"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Check,
    Loader2,
    Plus,
} from "lucide-react";
import {
    FormEvent,
    useEffect,
    useState,
} from "react";

import AdminShell from "@/components/admin/AdminShell";

import ProductImageUploader, {
    ProductUploadImage,
} from "@/components/admin/ProductImageUploader";


const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:5000";


type Category = {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
};


type ProductForm = {
    name: string;
    slug: string;
    description: string;
    price: string;
    compare_price: string;
    sku: string;
    stock: string;
    category_id: string;

    is_active: boolean;
    is_new: boolean;
    is_best_seller: boolean;

    is_customizable: boolean;
    customization_type: string;
    allow_custom_image: boolean;
    allow_custom_text: boolean;
    customization_price: string;
};


const initialForm: ProductForm = {
    name: "",
    slug: "",
    description: "",
    price: "",
    compare_price: "",
    sku: "",
    stock: "0",
    category_id: "",

    is_active: true,
    is_new: false,
    is_best_seller: false,

    is_customizable: false,
    customization_type: "",
    allow_custom_image: false,
    allow_custom_text: false,
    customization_price: "0",
};


export default function AddProductPage() {
    const router =
        useRouter();


    const [form, setForm] =
        useState<ProductForm>(
            initialForm
        );


    const [
        categories,
        setCategories,
    ] =
        useState<Category[]>([]);


    const [
        images,
        setImages,
    ] =
        useState<
            ProductUploadImage[]
        >([]);


    const [
        loadingCategories,
        setLoadingCategories,
    ] =
        useState(true);


    const [
        submitting,
        setSubmitting,
    ] =
        useState(false);


    const [
        error,
        setError,
    ] =
        useState("");


    const [
        success,
        setSuccess,
    ] =
        useState("");


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
                setLoadingCategories(
                    false
                );

                return;
            }


            try {
                const response =
                    await fetch(
                        `${API_URL}/api/admin/categories`,
                        {
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
                        "Unable to load categories."
                    );

                    return;
                }


                setCategories(
                    data.categories ||
                    []
                );
            } catch {
                setError(
                    "Unable to connect to the backend."
                );
            } finally {
                setLoadingCategories(
                    false
                );
            }
        }


        loadCategories();
    }, []);


    // ======================================================
    // HELPERS
    // ======================================================

    function updateField<
        K extends keyof ProductForm
    >(
        field: K,
        value: ProductForm[K]
    ) {
        setForm(
            (current) => ({
                ...current,
                [field]: value,
            })
        );
    }


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
                    createSlug(
                        value
                    ),
            })
        );
    }


    // ======================================================
    // CREATE PRODUCT
    // ======================================================

    async function handleSubmit(
        event:
            FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();


        setError("");
        setSuccess("");


        if (!form.name.trim()) {
            setError(
                "Product name is required."
            );

            return;
        }


        if (!form.slug.trim()) {
            setError(
                "Product slug is required."
            );

            return;
        }


        if (!form.price) {
            setError(
                "Product price is required."
            );

            return;
        }


        const price =
            Number(
                form.price
            );


        const stock =
            Number(
                form.stock ||
                0
            );


        if (
            Number.isNaN(
                price
            ) ||
            price < 0
        ) {
            setError(
                "Please enter a valid price."
            );

            return;
        }


        if (
            Number.isNaN(
                stock
            ) ||
            stock < 0
        ) {
            setError(
                "Please enter valid stock."
            );

            return;
        }


        if (
            form.compare_price &&
            (
                Number.isNaN(
                    Number(
                        form.compare_price
                    )
                ) ||
                Number(
                    form.compare_price
                ) < 0
            )
        ) {
            setError(
                "Please enter a valid compare price."
            );

            return;
        }



        if (form.is_customizable) {
            if (!form.customization_type) {
                setError(
                    "Please select a customization type."
                );

                return;
            }

            const customizationPrice =
                Number(
                    form.customization_price || 0
                );

            if (
                Number.isNaN(customizationPrice) ||
                customizationPrice < 0
            ) {
                setError(
                    "Please enter a valid customization price."
                );

                return;
            }

            if (
                !form.allow_custom_image &&
                !form.allow_custom_text
            ) {
                setError(
                    "Enable image upload, custom text, or both for a customizable product."
                );

                return;
            }
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


        const validImages =
            images.map(
                (
                    image,
                    index
                ) => ({
                    image_url:
                        image.image_url,

                    alt_text:
                        image.alt_text.trim() ||
                        form.name.trim(),

                    sort_order:
                        index,
                })
            );


        const payload = {
            name:
                form.name.trim(),

            slug:
                form.slug
                    .trim()
                    .toLowerCase(),

            description:
                form.description.trim() ||
                null,

            price,

            compare_price:
                form.compare_price
                    ? Number(
                        form.compare_price
                    )
                    : null,

            sku:
                form.sku.trim() ||
                null,

            stock,

            category_id:
                form.category_id
                    ? Number(
                        form.category_id
                    )
                    : null,

            is_active:
                form.is_active,

            is_new:
                form.is_new,

            is_best_seller:
                form.is_best_seller,

            is_customizable:
                form.is_customizable,

            customization_type:
                form.is_customizable
                    ? form.customization_type
                    : null,

            allow_custom_image:
                form.is_customizable
                    ? form.allow_custom_image
                    : false,

            allow_custom_text:
                form.is_customizable
                    ? form.allow_custom_text
                    : false,

            customization_price:
                form.is_customizable
                    ? Number(
                        form.customization_price || 0
                    )
                    : 0,

            images:
                validImages,
        };


        setSubmitting(
            true
        );


        try {
            const response =
                await fetch(
                    `${API_URL}/api/products`,
                    {
                        method:
                            "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`,
                        },

                        body:
                            JSON.stringify(
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
                    "Unable to create product."
                );

                return;
            }


            setSuccess(
                "Product created successfully."
            );


            setTimeout(
                () => {
                    router.push(
                        "/admin/products"
                    );

                    router.refresh();
                },
                600
            );
        } catch {
            setError(
                "Unable to connect to the backend."
            );
        } finally {
            setSubmitting(
                false
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
                                Products
                            </p>

                            <h1 className="mt-1.5 text-[23px] font-medium tracking-[-0.03em]">
                                Add Product
                            </h1>

                        </div>


                        <Link
                            href="/admin/products"
                            className="flex h-[42px] items-center gap-2 border border-black/10 px-4 text-[8px] font-semibold tracking-[0.14em] text-black uppercase transition hover:bg-black hover:!text-white"
                        >
                            <ArrowLeft
                                size={14}
                                strokeWidth={1.4}
                            />

                            Products
                        </Link>

                    </div>

                </header>


                <section className="mx-auto max-w-[1200px] px-5 py-8 md:px-8 lg:px-10 lg:py-10">

                    {/* INTRO */}

                    <div className="mb-8">

                        <p className="text-[8px] font-semibold tracking-[0.2em] text-black/35 uppercase">
                            New Product
                        </p>

                        <h2 className="mt-2 text-[30px] font-medium tracking-[-0.04em] sm:text-[36px]">
                            Product details
                        </h2>

                        <p className="mt-3 max-w-xl text-[10px] leading-5 text-black/40">
                            Add product information,
                            pricing, inventory and
                            upload product images.
                        </p>

                    </div>


                    {/* ERROR */}

                    {error && (
                        <div className="mb-6 border border-red-900/15 bg-red-950/[0.04] px-4 py-3">

                            <p className="text-[10px] leading-5 text-red-800">
                                {error}
                            </p>

                        </div>
                    )}


                    {/* SUCCESS */}

                    {success && (
                        <div className="mb-6 flex items-center gap-3 border border-black/10 bg-white/40 px-4 py-3">

                            <Check
                                size={15}
                                strokeWidth={1.5}
                            />

                            <p className="text-[10px]">
                                {success}
                            </p>

                        </div>
                    )}


                    <form
                        onSubmit={
                            handleSubmit
                        }
                    >

                        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">

                            {/* LEFT */}

                            <div className="space-y-6">

                                {/* BASIC INFORMATION */}

                                <FormSection
                                    title="Basic Information"
                                    description="Product name and description."
                                >

                                    <FormField
                                        label="Product Name"
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
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            placeholder="Mountain Graphic Oversized Tee"
                                            className={
                                                inputClass
                                            }
                                        />

                                    </FormField>


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
                                                updateField(
                                                    "slug",
                                                    createSlug(
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                )
                                            }
                                            placeholder="mountain-graphic-oversized-tee"
                                            className={
                                                inputClass
                                            }
                                        />

                                    </FormField>


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
                                                updateField(
                                                    "description",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            rows={6}
                                            placeholder="Describe the product..."
                                            className={`${inputClass} min-h-[140px] resize-y py-4`}
                                        />

                                    </FormField>

                                </FormSection>


                                {/* PRICING */}

                                <FormSection
                                    title="Pricing"
                                    description="Set product pricing."
                                >

                                    <div className="grid gap-4 sm:grid-cols-2">

                                        <FormField
                                            label="Price"
                                            required
                                        >

                                            <div className="relative">

                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[11px] text-black/40">
                                                    ₹
                                                </span>

                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={
                                                        form.price
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateField(
                                                            "price",
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    placeholder="1299"
                                                    className={`${inputClass} pl-8`}
                                                />

                                            </div>

                                        </FormField>


                                        <FormField
                                            label="Compare Price"
                                        >

                                            <div className="relative">

                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[11px] text-black/40">
                                                    ₹
                                                </span>

                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={
                                                        form.compare_price
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateField(
                                                            "compare_price",
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    placeholder="1599"
                                                    className={`${inputClass} pl-8`}
                                                />

                                            </div>

                                        </FormField>

                                    </div>

                                </FormSection>


                                {/* PRODUCT IMAGE UPLOADER */}

                                <FormSection
                                    title="Product Images"
                                    description="Upload up to 6 product images. The first image becomes the primary image."
                                >

                                    <ProductImageUploader
                                        images={
                                            images
                                        }
                                        onChange={
                                            setImages
                                        }
                                        productName={
                                            form.name
                                        }
                                        maxImages={6}
                                    />

                                </FormSection>

                            </div>


                            {/* RIGHT */}

                            <aside className="space-y-6">

                                {/* ORGANIZATION */}

                                <FormSection
                                    title="Organization"
                                    description="Category and inventory."
                                >

                                    <FormField
                                        label="Category"
                                    >

                                        <select
                                            value={
                                                form.category_id
                                            }
                                            disabled={
                                                loadingCategories
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                updateField(
                                                    "category_id",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            className={
                                                inputClass
                                            }
                                        >

                                            <option value="">
                                                {loadingCategories
                                                    ? "Loading categories..."
                                                    : "No Category"}
                                            </option>


                                            {categories.map(
                                                (
                                                    category
                                                ) => (
                                                    <option
                                                        key={
                                                            category.id
                                                        }
                                                        value={
                                                            category.id
                                                        }
                                                    >
                                                        {
                                                            category.name
                                                        }
                                                    </option>
                                                )
                                            )}

                                        </select>

                                    </FormField>


                                    <FormField
                                        label="SKU"
                                    >

                                        <input
                                            type="text"
                                            value={
                                                form.sku
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                updateField(
                                                    "sku",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            placeholder="OST-TEE-001"
                                            className={
                                                inputClass
                                            }
                                        />

                                    </FormField>


                                    <FormField
                                        label="Stock"
                                    >

                                        <input
                                            type="number"
                                            min="0"
                                            step="1"
                                            value={
                                                form.stock
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                updateField(
                                                    "stock",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            className={
                                                inputClass
                                            }
                                        />

                                    </FormField>

                                </FormSection>


                                {/* CUSTOMIZATION */}

                                <FormSection
                                    title="Customization"
                                    description="Allow customers to personalize this product."
                                >
                                    <ToggleRow
                                        title="Customizable Product"
                                        description="Show this product in the Ostren Fit customizer."
                                        checked={
                                            form.is_customizable
                                        }
                                        onChange={(checked) => {
                                            setForm(
                                                (current) => ({
                                                    ...current,

                                                    is_customizable:
                                                        checked,

                                                    customization_type:
                                                        checked
                                                            ? current.customization_type
                                                            : "",

                                                    allow_custom_image:
                                                        checked
                                                            ? current.allow_custom_image
                                                            : false,

                                                    allow_custom_text:
                                                        checked
                                                            ? current.allow_custom_text
                                                            : false,

                                                    customization_price:
                                                        checked
                                                            ? current.customization_price
                                                            : "0",
                                                })
                                            );
                                        }}
                                    />

                                    {form.is_customizable && (
                                        <div className="space-y-5 border-t border-black/10 pt-5">

                                            <FormField
                                                label="Customization Type"
                                                required
                                            >
                                                <select
                                                    value={
                                                        form.customization_type
                                                    }
                                                    onChange={(event) =>
                                                        updateField(
                                                            "customization_type",
                                                            event.target.value
                                                        )
                                                    }
                                                    className={
                                                        inputClass
                                                    }
                                                >
                                                    <option value="">
                                                        Select type
                                                    </option>

                                                    <option value="tshirt">
                                                        T-Shirt
                                                    </option>

                                                    <option value="hoodie">
                                                        Hoodie
                                                    </option>

                                                    <option value="mug">
                                                        Mug
                                                    </option>

                                                    <option value="bottle">
                                                        Bottle
                                                    </option>

                                                    <option value="frame">
                                                        Photo Frame
                                                    </option>
                                                </select>
                                            </FormField>

                                            <ToggleRow
                                                title="Allow Image Upload"
                                                description="Customer can upload their own image or artwork."
                                                checked={
                                                    form.allow_custom_image
                                                }
                                                onChange={(checked) =>
                                                    updateField(
                                                        "allow_custom_image",
                                                        checked
                                                    )
                                                }
                                            />

                                            <ToggleRow
                                                title="Allow Custom Text"
                                                description="Customer can add personalized text."
                                                checked={
                                                    form.allow_custom_text
                                                }
                                                onChange={(checked) =>
                                                    updateField(
                                                        "allow_custom_text",
                                                        checked
                                                    )
                                                }
                                            />

                                            <FormField
                                                label="Customization Charge"
                                            >
                                                <div className="relative">

                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[11px] text-black/40">
                                                        ₹
                                                    </span>

                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={
                                                            form.customization_price
                                                        }
                                                        onChange={(event) =>
                                                            updateField(
                                                                "customization_price",
                                                                event.target.value
                                                            )
                                                        }
                                                        placeholder="199"
                                                        className={`${inputClass} pl-8`}
                                                    />

                                                </div>

                                                <p className="mt-2 text-[7px] leading-4 text-black/35">
                                                    Added on top of the regular product price.
                                                </p>
                                            </FormField>

                                        </div>
                                    )}
                                </FormSection>

                                {/* STATUS */}

                                <FormSection
                                    title="Product Status"
                                    description="Control product visibility and labels."
                                >

                                    <ToggleRow
                                        title="Active"
                                        description="Show this product in the store."
                                        checked={
                                            form.is_active
                                        }
                                        onChange={(
                                            checked
                                        ) =>
                                            updateField(
                                                "is_active",
                                                checked
                                            )
                                        }
                                    />


                                    <ToggleRow
                                        title="New Arrival"
                                        description="Mark product as new."
                                        checked={
                                            form.is_new
                                        }
                                        onChange={(
                                            checked
                                        ) =>
                                            updateField(
                                                "is_new",
                                                checked
                                            )
                                        }
                                    />


                                    <ToggleRow
                                        title="Best Seller"
                                        description="Mark product as a best seller."
                                        checked={
                                            form.is_best_seller
                                        }
                                        onChange={(
                                            checked
                                        ) =>
                                            updateField(
                                                "is_best_seller",
                                                checked
                                            )
                                        }
                                    />

                                </FormSection>


                                {/* SAVE */}

                                <div className="border border-black/10 bg-white/30 p-5">

                                    <p className="text-[8px] font-semibold tracking-[0.16em] text-black/40 uppercase">
                                        Ready to publish?
                                    </p>

                                    <p className="mt-2 text-[9px] leading-5 text-black/35">
                                        The product and its
                                        uploaded images will
                                        be saved to your
                                        Ostren Fit store.
                                    </p>


                                    <button
                                        type="submit"
                                        disabled={
                                            submitting
                                        }
                                        className="mt-5 flex h-[50px] w-full items-center justify-center gap-2 bg-[#111111] text-[8px] font-semibold tracking-[0.16em] !text-white uppercase transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
                                    >

                                        {submitting ? (
                                            <>
                                                <Loader2
                                                    size={14}
                                                    strokeWidth={1.4}
                                                    className="animate-spin"
                                                />

                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <Plus
                                                    size={14}
                                                    strokeWidth={1.4}
                                                />

                                                Create Product
                                            </>
                                        )}

                                    </button>

                                </div>

                            </aside>

                        </div>

                    </form>

                </section>

            </main>

        </AdminShell>
    );
}


const inputClass =
    "h-[48px] w-full border border-black/10 bg-transparent px-4 text-[10px] text-[#111111] outline-none transition placeholder:text-black/25 focus:border-black disabled:cursor-not-allowed disabled:opacity-50";


function FormSection({
    title,
    description,
    children,
}: {
    title: string;
    description: string;
    children:
    React.ReactNode;
}) {
    return (
        <section className="border border-black/10 bg-white/25 p-5 sm:p-6">

            <div className="mb-6 border-b border-black/10 pb-5">

                <h3 className="text-[11px] font-medium">
                    {title}
                </h3>

                <p className="mt-1.5 text-[8px] leading-4 text-black/35">
                    {description}
                </p>

            </div>


            <div className="space-y-5">
                {children}
            </div>

        </section>
    );
}


function FormField({
    label,
    required = false,
    children,
}: {
    label: string;
    required?: boolean;
    children:
    React.ReactNode;
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


function ToggleRow({
    title,
    description,
    checked,
    onChange,
}: {
    title: string;
    description: string;
    checked: boolean;
    onChange: (
        checked: boolean
    ) => void;
}) {
    return (
        <div className="flex items-center justify-between gap-5 border-b border-black/10 pb-4 last:border-b-0 last:pb-0">

            <div>

                <p className="text-[9px] font-medium">
                    {title}
                </p>

                <p className="mt-1 text-[7px] leading-4 text-black/35">
                    {description}
                </p>

            </div>


            <button
                type="button"
                role="switch"
                aria-checked={
                    checked
                }
                onClick={() =>
                    onChange(
                        !checked
                    )
                }
                className={`
          relative h-[24px] w-[42px]
          shrink-0 rounded-full
          transition
          ${checked
                        ? "bg-[#111111]"
                        : "bg-black/10"
                    }
        `}
            >

                <span
                    className={`
            absolute top-[3px]
            h-[18px] w-[18px]
            rounded-full
            bg-white
            transition-transform
            ${checked
                            ? "translate-x-[21px]"
                            : "translate-x-[3px]"
                        }
          `}
                />

            </button>

        </div>
    );
}