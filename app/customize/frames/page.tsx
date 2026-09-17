"use client";

import Image from "next/image";
import Link from "next/link";

import {
  ArrowLeft,
  Check,
  ImagePlus,
  Minus,
  Plus,
  ShoppingBag,
  Upload,
  X,
} from "lucide-react";

import {
  ChangeEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ApiProduct,
  getCustomizableProductsByType,
} from "@/lib/products-api";

import {
  useCart,
} from "@/context/CartContext";


const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:5000";


export default function FramesCustomizerPage() {
  const {
    addToCart,
  } = useCart();


  const [
    products,
    setProducts,
  ] =
    useState<ApiProduct[]>([]);


  const [
    selectedProduct,
    setSelectedProduct,
  ] =
    useState<ApiProduct | null>(
      null
    );


  const [
    customText,
    setCustomText,
  ] =
    useState("");


  const [
    uploadedImage,
    setUploadedImage,
  ] =
    useState<string | null>(
      null
    );


  const [
    uploadingImage,
    setUploadingImage,
  ] =
    useState(false);


  const [
    quantity,
    setQuantity,
  ] =
    useState(1);


  const [
    loading,
    setLoading,
  ] =
    useState(true);


  const [
    error,
    setError,
  ] =
    useState("");


  const [
    added,
    setAdded,
  ] =
    useState(false);


  /* =====================================================
     LOAD CUSTOMIZABLE FRAMES
  ===================================================== */

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(
          true
        );

        setError("");

        const result =
          await getCustomizableProductsByType(
            "frame"
          );

        setProducts(
          result
        );

        if (
          result.length > 0
        ) {
          setSelectedProduct(
            result[0]
          );
        }
      } catch {
        setError(
          "Unable to load customizable photo frames."
        );
      } finally {
        setLoading(
          false
        );
      }
    }


    loadProducts();
  }, []);


  /* =====================================================
     PRODUCT IMAGE
  ===================================================== */

  const productImage =
    useMemo(
      () =>
        selectedProduct
          ?.images
          ?.slice()
          .sort(
            (
              first,
              second
            ) =>
              (
                first.sort_order ??
                0
              ) -
              (
                second.sort_order ??
                0
              )
          )[0]
          ?.image_url ||
        "",
      [
        selectedProduct,
      ]
    );


  /* =====================================================
     PRICING
  ===================================================== */

  const basePrice =
    Number(
      selectedProduct
        ?.price ||
        0
    );


  const customizationPrice =
    Number(
      selectedProduct
        ?.customization_price ||
        0
    );


  const unitPrice =
    basePrice +
    customizationPrice;


  const total =
    unitPrice *
    quantity;


  /* =====================================================
     IMAGE UPLOAD
  ===================================================== */

  async function handleImageUpload(
    event:
      ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];


    if (!file) {
      return;
    }


    /* ---------------------------------------------------
       FILE TYPE
    --------------------------------------------------- */

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
    ];


    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      setError(
        "Please choose a PNG, JPG, JPEG or WEBP image."
      );

      event.target.value =
        "";

      return;
    }


    /* ---------------------------------------------------
       FILE SIZE
    --------------------------------------------------- */

    if (
      file.size >
      10 * 1024 * 1024
    ) {
      setError(
        "Image must be smaller than 10 MB."
      );

      event.target.value =
        "";

      return;
    }


    /* ---------------------------------------------------
       CUSTOMER TOKEN
    --------------------------------------------------- */

    const token =
      localStorage.getItem(
        "ostren-access-token"
      );


    if (!token) {
      setError(
        "Please login before uploading your customization image."
      );

      event.target.value =
        "";

      return;
    }


    setError("");
    setAdded(false);
    setUploadingImage(true);


    try {
      /* -------------------------------------------------
         FORM DATA
      ------------------------------------------------- */

      const formData =
        new FormData();


      formData.append(
        "image",
        file
      );


      /* -------------------------------------------------
         UPLOAD
      ------------------------------------------------- */

      const response =
        await fetch(
          `${API_URL}/api/uploads/customization-image`,
          {
            method:
              "POST",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },

            body:
              formData,
          }
        );


      const data =
        await response.json();


      if (
        !response.ok ||
        !data.success ||
        !data.image_url
      ) {
        setError(
          data.message ||
            "Unable to upload image."
        );

        return;
      }


      /* -------------------------------------------------
         PERMANENT SERVER IMAGE URL
      ------------------------------------------------- */

      setUploadedImage(
        String(
          data.image_url
        )
      );


      setError("");
    } catch {
      setError(
        "Unable to connect to the backend."
      );
    } finally {
      setUploadingImage(
        false
      );

      event.target.value =
        "";
    }
  }


  /* =====================================================
     REMOVE IMAGE
  ===================================================== */

  function removeUploadedImage() {
    setUploadedImage(
      null
    );

    setAdded(
      false
    );

    setError("");
  }


  /* =====================================================
     CHANGE PRODUCT
  ===================================================== */

  function selectProduct(
    product:
      ApiProduct
  ) {
    setSelectedProduct(
      product
    );

    setQuantity(
      1
    );

    setCustomText(
      ""
    );

    setUploadedImage(
      null
    );

    setError(
      ""
    );

    setAdded(
      false
    );
  }


  /* =====================================================
     ADD TO CART
  ===================================================== */

  function handleAddToCart() {
    /* ---------------------------------------------------
       WAIT FOR UPLOAD
    --------------------------------------------------- */

    if (
      uploadingImage
    ) {
      setError(
        "Please wait for your image to finish uploading."
      );

      return;
    }


    if (
      !selectedProduct
    ) {
      return;
    }


    /* ---------------------------------------------------
       PHOTO REQUIRED
    --------------------------------------------------- */

    if (
      selectedProduct.allow_custom_image &&
      !uploadedImage
    ) {
      setError(
        "Please upload a photo before adding this product to your bag."
      );

      return;
    }


    /* ---------------------------------------------------
       TEXT VALIDATION
    --------------------------------------------------- */

    if (
      selectedProduct.allow_custom_text &&
      customText.length > 60
    ) {
      setError(
        "Custom text must be 60 characters or less."
      );

      return;
    }


    if (
      selectedProduct.stock <= 0
    ) {
      setError(
        "This product is currently out of stock."
      );

      return;
    }


    setError("");


    /* ---------------------------------------------------
       ADD UNIQUE CUSTOMIZED ITEM
    --------------------------------------------------- */

    addToCart(
      {
        id:
          selectedProduct.id,

        name:
          selectedProduct.name,

        price:
          unitPrice,

        image:
          productImage,

        customization: {
          type:
            "frame",

          customText:
            selectedProduct.allow_custom_text
              ? customText.trim() ||
                undefined
              : undefined,

          uploadedImage:
            selectedProduct.allow_custom_image
              ? uploadedImage ||
                undefined
              : undefined,

          placement:
            "Frame artwork area",

          customizationPrice:
            customizationPrice,
        },
      },

      quantity
    );


    setAdded(
      true
    );
  }


  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f5f2ec]">

        <div className="text-center">

          <div className="mx-auto h-6 w-6 animate-spin rounded-full border border-black/15 border-t-black" />

          <p className="mt-4 text-[8px] font-semibold tracking-[0.18em] text-black/35 uppercase">
            Loading customizer
          </p>

        </div>

      </main>
    );
  }


  /* =====================================================
     NO PRODUCTS
  ===================================================== */

  if (
    !selectedProduct
  ) {
    return (
      <main className="min-h-[70vh] bg-[#f5f2ec] px-5 py-20">

        <div className="mx-auto max-w-xl text-center">

          <p className="text-[8px] font-semibold tracking-[0.2em] text-black/35 uppercase">
            Customize
          </p>

          <h1 className="mt-4 text-[38px] font-medium tracking-[-0.05em]">
            No customizable frames yet.
          </h1>

          <p className="mx-auto mt-5 max-w-md text-[11px] leading-6 text-black/45">
            Customizable photo frames will appear here once they are enabled.
          </p>


          <Link
            href="/customize"
            className="mx-auto mt-8 flex h-[48px] w-fit items-center gap-2 border border-black px-5 text-[8px] font-semibold tracking-[0.15em] uppercase"
          >
            <ArrowLeft
              size={13}
            />

            Back to Customize
          </Link>

        </div>

      </main>
    );
  }


  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <main className="min-h-screen bg-[#f5f2ec] text-[#111111]">

      {/* =================================================
          HEADER
      ================================================== */}

      <section className="border-b border-black/10">

        <div className="mx-auto flex min-h-[84px] max-w-[1500px] items-center justify-between px-5 md:px-8 lg:px-10">

          <div>

            <p className="text-[7px] font-semibold tracking-[0.22em] text-black/35 uppercase">
              Ostren Fit Custom
            </p>

            <h1 className="mt-1 text-[22px] font-medium tracking-[-0.035em]">
              Photo Frame Studio
            </h1>

          </div>


          <Link
            href="/customize"
            className="flex h-[42px] items-center gap-2 border border-black/10 px-4 text-[8px] font-semibold tracking-[0.14em] uppercase transition hover:bg-black hover:!text-white"
          >
            <ArrowLeft
              size={13}
            />

            Customize
          </Link>

        </div>

      </section>


      {/* =================================================
          INTRO
      ================================================== */}

      <section className="border-b border-black/10">

        <div className="mx-auto max-w-[1500px] px-5 py-10 md:px-8 lg:px-10 lg:py-14">

          <p className="text-[8px] font-semibold tracking-[0.22em] text-black/35 uppercase">
            Make it yours
          </p>

          <h2 className="mt-3 max-w-3xl text-[38px] font-medium leading-[0.98] tracking-[-0.055em] sm:text-[50px] lg:text-[62px]">
            Turn a memory into something you can keep.
          </h2>

          <p className="mt-5 max-w-xl text-[11px] leading-6 text-black/45">
            Choose a frame, upload your photo and add a personal message.
            Preview your idea before adding it to your bag.
          </p>

        </div>

      </section>


      {/* =================================================
          PRODUCT SELECTOR
      ================================================== */}

      {products.length > 1 && (
        <section className="border-b border-black/10">

          <div className="mx-auto max-w-[1500px] px-5 py-7 md:px-8 lg:px-10">

            <p className="mb-4 text-[7px] font-semibold tracking-[0.18em] text-black/35 uppercase">
              Choose your frame
            </p>


            <div className="flex gap-3 overflow-x-auto pb-1">

              {products.map(
                (
                  product
                ) => {
                  const image =
                    product.images
                      ?.slice()
                      .sort(
                        (
                          first,
                          second
                        ) =>
                          (
                            first.sort_order ??
                            0
                          ) -
                          (
                            second.sort_order ??
                            0
                          )
                      )[0]
                      ?.image_url ||
                    "";


                  const active =
                    selectedProduct.id ===
                    product.id;


                  const productFinalPrice =
                    Number(
                      product.price
                    ) +
                    Number(
                      product.customization_price
                    );


                  return (
                    <button
                      key={
                        product.id
                      }
                      type="button"
                      onClick={() =>
                        selectProduct(
                          product
                        )
                      }
                      className={`
                        flex min-w-[220px]
                        items-center gap-3
                        border p-3 text-left
                        transition
                        ${
                          active
                            ? "border-black bg-black !text-white"
                            : "border-black/10 bg-white/20 hover:border-black/30"
                        }
                      `}
                    >

                      <div className="relative h-[64px] w-[52px] shrink-0 overflow-hidden bg-black/5">

                        {image && (
                          <Image
                            src={
                              image
                            }
                            alt={
                              product.name
                            }
                            fill
                            sizes="52px"
                            className="object-cover"
                          />
                        )}

                      </div>


                      <div className="min-w-0">

                        <p className="truncate text-[10px] font-medium">
                          {product.name}
                        </p>

                        <p
                          className={`
                            mt-1 text-[8px]
                            ${
                              active
                                ? "text-white/55"
                                : "text-black/40"
                            }
                          `}
                        >
                          ₹
                          {productFinalPrice.toLocaleString(
                            "en-IN"
                          )}
                        </p>

                      </div>

                    </button>
                  );
                }
              )}

            </div>

          </div>

        </section>
      )}


      {/* =================================================
          CUSTOMIZER
      ================================================== */}

      <section className="mx-auto grid max-w-[1500px] lg:grid-cols-[1.15fr_0.85fr]">

        {/* ===============================================
            PREVIEW
        ================================================ */}

        <div className="border-b border-black/10 p-5 md:p-8 lg:border-b-0 lg:border-r lg:p-10">

          <div className="mb-5 flex items-end justify-between">

            <div>

              <p className="text-[7px] font-semibold tracking-[0.18em] text-black/35 uppercase">
                Live Preview
              </p>

              <h3 className="mt-2 text-[22px] font-medium tracking-[-0.035em]">
                Your frame
              </h3>

            </div>


            <p className="text-[8px] text-black/35">
              Preview
            </p>

          </div>


          <div className="relative mx-auto aspect-square max-w-[720px] overflow-hidden bg-[#ebe7df]">

            {/* BASE PRODUCT */}

            {productImage ? (
              <Image
                src={
                  productImage
                }
                alt={
                  selectedProduct.name
                }
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-contain p-[7%]"
              />
            ) : (
              <div className="flex h-full items-center justify-center">

                <ImagePlus
                  size={34}
                  strokeWidth={1}
                  className="text-black/20"
                />

              </div>
            )}


            {/* CUSTOMER CUSTOMIZATION IMAGE */}

            {uploadedImage &&
              selectedProduct.allow_custom_image && (
                <div className="absolute left-1/2 top-[47%] h-[48%] w-[52%] -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-black/5 shadow-sm">

                  <img
                    src={
                      uploadedImage
                    }
                    alt="Custom preview"
                    className="h-full w-full object-cover"
                  />

                </div>
              )}


            {/* CUSTOM TEXT */}

            {customText.trim() &&
              selectedProduct.allow_custom_text && (
                <div className="absolute bottom-[12%] left-1/2 w-[60%] -translate-x-1/2 text-center">

                  <p className="break-words text-[11px] font-medium tracking-[0.03em] text-black sm:text-[14px]">
                    {customText}
                  </p>

                </div>
              )}

          </div>


          <p className="mx-auto mt-4 max-w-[620px] text-center text-[8px] leading-4 text-black/30">
            Preview is illustrative. Final print positioning may vary slightly during production.
          </p>

        </div>


        {/* ===============================================
            CONTROLS
        ================================================ */}

        <div className="p-5 md:p-8 lg:p-10">

          <div className="mx-auto max-w-[520px]">

            <p className="text-[7px] font-semibold tracking-[0.18em] text-black/35 uppercase">
              Customize
            </p>

            <h3 className="mt-2 text-[30px] font-medium tracking-[-0.045em]">
              {selectedProduct.name}
            </h3>


            {selectedProduct.description && (
              <p className="mt-4 text-[10px] leading-5 text-black/45">
                {selectedProduct.description}
              </p>
            )}


            {/* ERROR */}

            {error && (
              <div className="mt-6 border border-red-900/15 bg-red-950/[0.04] px-4 py-3">

                <p className="text-[9px] leading-5 text-red-800">
                  {error}
                </p>

              </div>
            )}


            {/* ===========================================
                IMAGE
            ============================================ */}

            {selectedProduct.allow_custom_image && (
              <div className="mt-8 border-t border-black/10 pt-7">

                <p className="text-[8px] font-semibold tracking-[0.15em] uppercase">
                  01 — Add your photo
                </p>


                {!uploadedImage ? (
                  <label
                    className={`
                      mt-4 flex min-h-[120px]
                      flex-col items-center
                      justify-center border
                      border-dashed
                      border-black/20 px-5
                      text-center transition
                      ${
                        uploadingImage
                          ? "cursor-wait opacity-70"
                          : "cursor-pointer hover:border-black/50"
                      }
                    `}
                  >

                    {uploadingImage ? (
                      <>
                        <div className="h-5 w-5 animate-spin rounded-full border border-black/15 border-t-black" />

                        <span className="mt-3 text-[8px] font-semibold tracking-[0.14em] uppercase">
                          Uploading...
                        </span>
                      </>
                    ) : (
                      <>
                        <Upload
                          size={18}
                          strokeWidth={1.3}
                        />

                        <span className="mt-3 text-[8px] font-semibold tracking-[0.14em] uppercase">
                          Choose image
                        </span>
                      </>
                    )}


                    <span className="mt-2 text-[7px] text-black/35">
                      JPG, PNG or WEBP · Max 10 MB
                    </span>


                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      disabled={
                        uploadingImage
                      }
                      onChange={
                        handleImageUpload
                      }
                      className="hidden"
                    />

                  </label>
                ) : (
                  <div className="mt-4 flex items-center gap-4 border border-black/10 p-3">

                    <div className="h-[70px] w-[70px] shrink-0 overflow-hidden bg-black/5">

                      <img
                        src={
                          uploadedImage
                        }
                        alt="Uploaded customization"
                        className="h-full w-full object-cover"
                      />

                    </div>


                    <div className="min-w-0 flex-1">

                      <p className="text-[9px] font-medium">
                        Photo added
                      </p>

                      <p className="mt-1 text-[7px] text-black/35">
                        Uploaded successfully · Ready for preview
                      </p>

                    </div>


                    <button
                      type="button"
                      onClick={
                        removeUploadedImage
                      }
                      className="flex h-9 w-9 shrink-0 items-center justify-center border border-black/10 transition hover:bg-black hover:!text-white"
                      aria-label="Remove image"
                    >
                      <X
                        size={13}
                      />
                    </button>

                  </div>
                )}

              </div>
            )}


            {/* ===========================================
                TEXT
            ============================================ */}

            {selectedProduct.allow_custom_text && (
              <div className="mt-7 border-t border-black/10 pt-7">

                <div className="flex items-center justify-between gap-4">

                  <p className="text-[8px] font-semibold tracking-[0.15em] uppercase">
                    02 — Add your message
                  </p>

                  <p className="text-[7px] text-black/30">
                    {customText.length}/60
                  </p>

                </div>


                <input
                  type="text"
                  maxLength={60}
                  value={
                    customText
                  }
                  onChange={(
                    event
                  ) => {
                    setCustomText(
                      event.target.value
                    );

                    setAdded(
                      false
                    );

                    setError(
                      ""
                    );
                  }}
                  placeholder="Our favourite memory"
                  className="mt-4 h-[50px] w-full border border-black/10 bg-transparent px-4 text-[10px] outline-none transition placeholder:text-black/25 focus:border-black"
                />

              </div>
            )}


            {/* ===========================================
                QUANTITY
            ============================================ */}

            <div className="mt-7 border-t border-black/10 pt-7">

              <p className="text-[8px] font-semibold tracking-[0.15em] uppercase">
                Quantity
              </p>


              <div className="mt-4 flex h-[46px] w-fit items-center border border-black/10">

                <button
                  type="button"
                  onClick={() => {
                    setQuantity(
                      (
                        current
                      ) =>
                        Math.max(
                          1,
                          current - 1
                        )
                    );

                    setAdded(
                      false
                    );
                  }}
                  disabled={
                    quantity <= 1
                  }
                  className="flex h-full w-11 items-center justify-center disabled:cursor-not-allowed disabled:opacity-20"
                  aria-label="Decrease quantity"
                >
                  <Minus
                    size={13}
                  />
                </button>


                <span className="flex h-full min-w-11 items-center justify-center border-x border-black/10 text-[10px]">
                  {quantity}
                </span>


                <button
                  type="button"
                  onClick={() => {
                    setQuantity(
                      (
                        current
                      ) =>
                        current + 1
                    );

                    setAdded(
                      false
                    );
                  }}
                  className="flex h-full w-11 items-center justify-center"
                  aria-label="Increase quantity"
                >
                  <Plus
                    size={13}
                  />
                </button>

              </div>

            </div>


            {/* ===========================================
                PRICE
            ============================================ */}

            <div className="mt-8 border-y border-black/10 py-5">

              <div className="flex justify-between gap-4 text-[9px] text-black/45">

                <span>
                  Base product
                </span>

                <span>
                  ₹
                  {basePrice.toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>


              <div className="mt-2 flex justify-between gap-4 text-[9px] text-black/45">

                <span>
                  Customization
                </span>

                <span>
                  ₹
                  {customizationPrice.toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>


              <div className="mt-5 flex items-end justify-between gap-4 border-t border-black/10 pt-5">

                <div>

                  <p className="text-[7px] font-semibold tracking-[0.15em] text-black/35 uppercase">
                    Total
                  </p>

                  <p className="mt-1 text-[9px] text-black/35">
                    {quantity} × ₹
                    {unitPrice.toLocaleString(
                      "en-IN"
                    )}
                  </p>

                </div>


                <p className="text-[24px] font-medium tracking-[-0.04em]">
                  ₹
                  {total.toLocaleString(
                    "en-IN"
                  )}
                </p>

              </div>

            </div>


            {/* ===========================================
                ADD TO BAG
            ============================================ */}

            <button
              type="button"
              onClick={
                handleAddToCart
              }
              disabled={
                selectedProduct.stock <= 0 ||
                uploadingImage
              }
              className="mt-6 flex h-[54px] w-full items-center justify-center gap-2 bg-[#111111] text-[8px] font-semibold tracking-[0.17em] !text-white uppercase transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-30"
            >

              {added ? (
                <>
                  <Check
                    size={14}
                  />

                  Added to Bag
                </>
              ) : (
                <>
                  <ShoppingBag
                    size={14}
                  />

                  {selectedProduct.stock > 0
                    ? "Add Customized Item"
                    : "Out of Stock"}
                </>
              )}

            </button>


            {added && (
              <Link
                href="/cart"
                className="mt-3 flex h-[48px] w-full items-center justify-center border border-black text-[8px] font-semibold tracking-[0.15em] uppercase transition hover:bg-black hover:!text-white"
              >
                View Bag
              </Link>
            )}


            <p className="mt-4 text-center text-[7px] leading-4 text-black/30">
              Personalized products are created specifically from your submitted design.
            </p>

          </div>

        </div>

      </section>

    </main>
  );
}