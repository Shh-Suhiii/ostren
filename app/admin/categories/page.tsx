"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Check,
  Edit3,
  FolderPlus,
  Layers3,
  Loader2,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import AdminShell from "@/components/admin/AdminShell";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:5000";


type Category = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
};


type CategoriesResponse = {
  success: boolean;
  message?: string;
  count?: number;
  categories?: Category[];
};


type CategoryForm = {
  name: string;
  slug: string;
  description: string;
};


const emptyForm: CategoryForm = {
  name: "",
  slug: "",
  description: "",
};


export default function AdminCategoriesPage() {
  const [categories, setCategories] =
    useState<Category[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [modalOpen, setModalOpen] =
    useState(false);

  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);

  const [form, setForm] =
    useState<CategoryForm>(
      emptyForm
    );


  // ======================================================
  // LOAD CATEGORIES
  // ======================================================

  useEffect(() => {
    async function loadCategories() {
      const token =
        localStorage.getItem(
          "ostren-admin-token"
        );

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/admin/categories`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        const data: CategoriesResponse =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          setError(
            data.message ||
              "Unable to load categories."
          );

          return;
        }

        setCategories(
          data.categories || []
        );
      } catch {
        setError(
          "Unable to connect to the backend."
        );
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);


  // ======================================================
  // SEARCH
  // ======================================================

  const filteredCategories =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return categories;
      }

      return categories.filter(
        (category) =>
          category.name
            .toLowerCase()
            .includes(query) ||
          category.slug
            .toLowerCase()
            .includes(query) ||
          category.description
            ?.toLowerCase()
            .includes(query)
      );
    }, [
      categories,
      search,
    ]);


  // ======================================================
  // HELPERS
  // ======================================================

  function createSlug(
    value: string
  ) {
    return value
      .toLowerCase()
      .trim()
      .replace(
        /[^a-z0-9\s-]/g,
        ""
      )
      .replace(
        /\s+/g,
        "-"
      )
      .replace(
        /-+/g,
        "-"
      );
  }


  function handleNameChange(
    value: string
  ) {
    setForm(
      (current) => ({
        ...current,
        name: value,

        slug:
          editingCategory
            ? current.slug
            : createSlug(
                value
              ),
      })
    );
  }


  function openCreateModal() {
    setEditingCategory(
      null
    );

    setForm(
      emptyForm
    );

    setError("");
    setSuccess("");

    setModalOpen(
      true
    );
  }


  function openEditModal(
    category: Category
  ) {
    setEditingCategory(
      category
    );

    setForm({
      name:
        category.name,

      slug:
        category.slug,

      description:
        category.description ||
        "",
    });

    setError("");
    setSuccess("");

    setModalOpen(
      true
    );
  }


  function closeModal() {
    if (saving) {
      return;
    }

    setModalOpen(
      false
    );

    setEditingCategory(
      null
    );

    setForm(
      emptyForm
    );
  }


  // ======================================================
  // CREATE / UPDATE
  // ======================================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");


    if (!form.name.trim()) {
      setError(
        "Category name is required."
      );

      return;
    }


    if (!form.slug.trim()) {
      setError(
        "Category slug is required."
      );

      return;
    }


    const token =
      localStorage.getItem(
        "ostren-admin-token"
      );


    if (!token) {
      setError(
        "Admin session expired. Please login again."
      );

      return;
    }


    const payload = {
      name:
        form.name.trim(),

      slug:
        createSlug(
          form.slug
        ),

      description:
        form.description.trim() ||
        null,
    };


    setSaving(
      true
    );


    try {
      const isEditing =
        Boolean(
          editingCategory
        );


      const endpoint =
        isEditing
          ? `${API_URL}/api/categories/${editingCategory?.id}`
          : `${API_URL}/api/categories`;


      const response =
        await fetch(
          endpoint,
          {
            method:
              isEditing
                ? "PUT"
                : "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify(
              payload
            ),
          }
        );


      const data =
        await response.json();


      if (
        !response.ok ||
        !data.success
      ) {
        setError(
          data.message ||
            (
              isEditing
                ? "Unable to update category."
                : "Unable to create category."
            )
        );

        return;
      }


      const savedCategory:
        Category =
          data.category;


      if (isEditing) {
        setCategories(
          (current) =>
            current
              .map(
                (
                  category
                ) =>
                  category.id ===
                  savedCategory.id
                    ? savedCategory
                    : category
              )
              .sort(
                (
                  first,
                  second
                ) =>
                  first.name.localeCompare(
                    second.name
                  )
              )
        );


        setSuccess(
          "Category updated successfully."
        );
      } else {
        setCategories(
          (current) =>
            [
              savedCategory,
              ...current,
            ].sort(
              (
                first,
                second
              ) =>
                first.name.localeCompare(
                  second.name
                )
            )
        );


        setSuccess(
          "Category created successfully."
        );
      }


      setModalOpen(
        false
      );

      setEditingCategory(
        null
      );

      setForm(
        emptyForm
      );


      window.setTimeout(
        () => {
          setSuccess(
            ""
          );
        },
        2500
      );
    } catch {
      setError(
        "Unable to connect to the backend."
      );
    } finally {
      setSaving(
        false
      );
    }
  }


  // ======================================================
  // DELETE
  // ======================================================

  async function handleDelete(
    category: Category
  ) {
    const confirmed =
      window.confirm(
        `Delete "${category.name}" category?`
      );


    if (!confirmed) {
      return;
    }


    const token =
      localStorage.getItem(
        "ostren-admin-token"
      );


    if (!token) {
      setError(
        "Admin session expired. Please login again."
      );

      return;
    }


    setError("");
    setSuccess("");

    setDeletingId(
      category.id
    );


    try {
      const response =
        await fetch(
          `${API_URL}/api/categories/${category.id}`,
          {
            method:
              "DELETE",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      const data =
        await response.json();


      if (
        !response.ok ||
        !data.success
      ) {
        setError(
          data.message ||
            "Unable to delete category."
        );

        return;
      }


      setCategories(
        (current) =>
          current.filter(
            (item) =>
              item.id !==
              category.id
          )
      );


      setSuccess(
        "Category deleted successfully."
      );


      window.setTimeout(
        () => {
          setSuccess(
            ""
          );
        },
        2500
      );
    } catch {
      setError(
        "Unable to delete category."
      );
    } finally {
      setDeletingId(
        null
      );
    }
  }


  // ======================================================
  // PAGE
  // ======================================================

  return (
    <AdminShell>

      <main className="min-h-screen">

        {/* HEADER */}

        <header className="border-b border-black/10">

          <div className="mx-auto flex min-h-[88px] max-w-[1500px] items-center justify-between gap-4 px-5 md:px-8 lg:px-10">

            <div>

              <p className="text-[7px] font-semibold tracking-[0.23em] text-black/35 uppercase">
                Management
              </p>

              <h1 className="mt-1.5 text-[23px] font-medium tracking-[-0.03em]">
                Categories
              </h1>

            </div>


            <button
              type="button"
              onClick={
                openCreateModal
              }
              className="flex h-[44px] items-center gap-2 bg-[#111111] px-4 text-[8px] font-semibold tracking-[0.15em] !text-white uppercase transition hover:bg-black/80"
            >
              <Plus
                size={14}
                strokeWidth={1.5}
              />

              Add Category
            </button>

          </div>

        </header>


        {/* CONTENT */}

        <section className="mx-auto max-w-[1500px] px-5 py-8 md:px-8 lg:px-10 lg:py-10">

          {/* INTRO + SEARCH */}

          <div className="flex flex-col gap-5 border-b border-black/10 pb-7 md:flex-row md:items-end md:justify-between">

            <div>

              <p className="text-[8px] font-semibold tracking-[0.2em] text-black/35 uppercase">
                Store Organization
              </p>

              <h2 className="mt-2 text-[30px] font-medium tracking-[-0.04em]">
                All Categories
              </h2>

              <p className="mt-2 text-[10px] text-black/40">
                {categories.length}{" "}
                categories in your
                store
              </p>

            </div>


            <div className="relative w-full md:w-[300px]">

              <Search
                size={15}
                strokeWidth={1.4}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
              />

              <input
                type="search"
                value={search}
                onChange={(
                  event
                ) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search categories..."
                className="h-[46px] w-full border border-black/10 bg-transparent pl-11 pr-4 text-[10px] outline-none transition placeholder:text-black/30 focus:border-black"
              />

            </div>

          </div>


          {/* SUCCESS */}

          {success && (
            <div className="mt-6 flex items-center gap-3 border border-black/10 bg-white/40 px-4 py-3">

              <Check
                size={15}
                strokeWidth={1.5}
              />

              <p className="text-[10px]">
                {success}
              </p>

            </div>
          )}


          {/* ERROR */}

          {error && (
            <div className="mt-6 border border-red-900/15 bg-red-950/[0.04] px-4 py-3">

              <p className="text-[10px] leading-5 text-red-800">
                {error}
              </p>

            </div>
          )}


          {/* LOADING */}

          {loading && (
            <div className="flex min-h-[400px] items-center justify-center">

              <div className="text-center">

                <Loader2
                  size={20}
                  strokeWidth={1.3}
                  className="mx-auto animate-spin text-black/40"
                />

                <p className="mt-4 text-[8px] font-semibold tracking-[0.18em] text-black/30 uppercase">
                  Loading categories...
                </p>

              </div>

            </div>
          )}


          {/* EMPTY */}

          {!loading &&
            filteredCategories.length ===
              0 && (
              <div className="flex min-h-[350px] flex-col items-center justify-center border-b border-black/10 text-center">

                <Layers3
                  size={28}
                  strokeWidth={1.1}
                  className="text-black/25"
                />

                <p className="mt-4 text-[11px] font-medium">
                  No categories found.
                </p>

                <p className="mt-2 text-[9px] text-black/35">
                  Create a category
                  or try another
                  search.
                </p>

              </div>
            )}


          {/* CATEGORY GRID */}

          {!loading &&
            filteredCategories.length >
              0 && (
              <div className="grid gap-4 pt-6 sm:grid-cols-2 xl:grid-cols-3">

                {filteredCategories.map(
                  (
                    category
                  ) => (
                    <article
                      key={
                        category.id
                      }
                      className="group border border-black/10 bg-white/25 p-5 transition-colors hover:bg-white/50 sm:p-6"
                    >

                      <div className="flex items-start justify-between gap-5">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-black/10 bg-black/[0.025]">

                          <Layers3
                            size={16}
                            strokeWidth={1.3}
                            className="text-black/45"
                          />

                        </div>


                        <div className="flex gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(
                                category
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center border border-black/10 text-black/45 transition hover:bg-black hover:text-white"
                            aria-label={`Edit ${category.name}`}
                          >
                            <Edit3
                              size={13}
                              strokeWidth={1.4}
                            />
                          </button>


                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                category
                              )
                            }
                            disabled={
                              deletingId ===
                              category.id
                            }
                            className="flex h-9 w-9 items-center justify-center border border-black/10 text-black/45 transition hover:border-red-700 hover:bg-red-700 hover:text-white disabled:opacity-30"
                            aria-label={`Delete ${category.name}`}
                          >
                            {deletingId ===
                            category.id ? (
                              <Loader2
                                size={13}
                                strokeWidth={1.4}
                                className="animate-spin"
                              />
                            ) : (
                              <Trash2
                                size={13}
                                strokeWidth={1.4}
                              />
                            )}
                          </button>

                        </div>

                      </div>


                      <div className="mt-7">

                        <p className="text-[7px] font-semibold tracking-[0.17em] text-black/30 uppercase">
                          Category
                        </p>

                        <h3 className="mt-2 text-[18px] font-medium tracking-[-0.025em]">
                          {
                            category.name
                          }
                        </h3>


                        <p className="mt-2 text-[8px] text-black/35">
                          /
                          {
                            category.slug
                          }
                        </p>


                        <p className="mt-5 min-h-[40px] text-[9px] leading-5 text-black/45">
                          {category.description ||
                            "No description added."}
                        </p>

                      </div>

                    </article>
                  )
                )}

              </div>
            )}

        </section>


        {/* ================================================
            CREATE / EDIT MODAL
        ================================================= */}

        {modalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

            {/* BACKDROP */}

            <button
              type="button"
              aria-label="Close category modal"
              onClick={
                closeModal
              }
              className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
            />


            {/* MODAL */}

            <div className="relative z-10 w-full max-w-[520px] border border-black/10 bg-[var(--ostren-off-white)] shadow-2xl">

              {/* MODAL HEADER */}

              <div className="flex items-start justify-between border-b border-black/10 px-5 py-5 sm:px-6">

                <div>

                  <p className="text-[7px] font-semibold tracking-[0.2em] text-black/35 uppercase">
                    {editingCategory
                      ? "Edit Category"
                      : "New Category"}
                  </p>

                  <h3 className="mt-2 text-[22px] font-medium tracking-[-0.03em]">
                    {editingCategory
                      ? editingCategory.name
                      : "Add Category"}
                  </h3>

                </div>


                <button
                  type="button"
                  onClick={
                    closeModal
                  }
                  className="flex h-9 w-9 items-center justify-center border border-black/10 text-black/45 transition hover:bg-black hover:text-white"
                >
                  <X
                    size={15}
                    strokeWidth={1.4}
                  />
                </button>

              </div>


              <form
                onSubmit={
                  handleSubmit
                }
                className="p-5 sm:p-6"
              >

                <div className="space-y-5">

                  {/* NAME */}

                  <FormField
                    label="Category Name"
                    required
                  >

                    <input
                      type="text"
                      value={
                        form.name
                      }
                      onChange={(
                        event
                      ) =>
                        handleNameChange(
                          event.target.value
                        )
                      }
                      placeholder="Oversized T-Shirts"
                      className={
                        inputClass
                      }
                      autoFocus
                    />

                  </FormField>


                  {/* SLUG */}

                  <FormField
                    label="Slug"
                    required
                  >

                    <input
                      type="text"
                      value={
                        form.slug
                      }
                      onChange={(
                        event
                      ) =>
                        setForm(
                          (
                            current
                          ) => ({
                            ...current,

                            slug:
                              createSlug(
                                event.target.value
                              ),
                          })
                        )
                      }
                      placeholder="oversized-t-shirts"
                      className={
                        inputClass
                      }
                    />

                  </FormField>


                  {/* DESCRIPTION */}

                  <FormField
                    label="Description"
                  >

                    <textarea
                      value={
                        form.description
                      }
                      onChange={(
                        event
                      ) =>
                        setForm(
                          (
                            current
                          ) => ({
                            ...current,

                            description:
                              event.target.value,
                          })
                        )
                      }
                      rows={4}
                      placeholder="Short category description..."
                      className={`${inputClass} min-h-[110px] resize-y py-4`}
                    />

                  </FormField>

                </div>


                {/* MODAL ACTIONS */}

                <div className="mt-7 flex flex-col-reverse gap-3 border-t border-black/10 pt-5 sm:flex-row sm:justify-end">

                  <button
                    type="button"
                    onClick={
                      closeModal
                    }
                    disabled={
                      saving
                    }
                    className="h-[46px] border border-black/10 px-5 text-[8px] font-semibold tracking-[0.14em] uppercase transition hover:bg-black/5 disabled:opacity-40"
                  >
                    Cancel
                  </button>


                  <button
                    type="submit"
                    disabled={
                      saving
                    }
                    className="flex h-[46px] items-center justify-center gap-2 bg-[#111111] px-6 text-[8px] font-semibold tracking-[0.14em] !text-white uppercase transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
                  >

                    {saving ? (
                      <>
                        <Loader2
                          size={13}
                          strokeWidth={1.4}
                          className="animate-spin"
                        />

                        Saving...
                      </>
                    ) : editingCategory ? (
                      <>
                        <Check
                          size={13}
                          strokeWidth={1.4}
                        />

                        Save Changes
                      </>
                    ) : (
                      <>
                        <FolderPlus
                          size={13}
                          strokeWidth={1.4}
                        />

                        Create Category
                      </>
                    )}

                  </button>

                </div>

              </form>

            </div>

          </div>
        )}

      </main>

    </AdminShell>
  );
}


const inputClass =
  "h-[48px] w-full border border-black/10 bg-transparent px-4 text-[10px] text-[#111111] outline-none transition placeholder:text-black/25 focus:border-black";


function FormField({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>

      <label className="mb-2 block text-[7px] font-semibold tracking-[0.15em] text-black/40 uppercase">

        {label}

        {required && (
          <span className="ml-1 text-black">
            *
          </span>
        )}

      </label>

      {children}

    </div>
  );
}