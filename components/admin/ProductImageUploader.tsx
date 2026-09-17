"use client";

import Image from "next/image";
import {
  ChangeEvent,
  useRef,
  useState,
} from "react";

import {
  ImagePlus,
  Loader2,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";


const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:5000";


export type ProductUploadImage = {
  image_url: string;
  alt_text: string;
};


type ProductImageUploaderProps = {
  images: ProductUploadImage[];
  onChange: (
    images: ProductUploadImage[]
  ) => void;
  productName?: string;
  maxImages?: number;
};


export default function ProductImageUploader({
  images,
  onChange,
  productName = "",
  maxImages = 6,
}: ProductImageUploaderProps) {
  const inputRef =
    useRef<HTMLInputElement | null>(
      null
    );

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState("");


  // ======================================================
  // SELECT IMAGE
  // ======================================================

  function openFilePicker() {
    if (uploading) {
      return;
    }

    inputRef.current?.click();
  }


  // ======================================================
  // UPLOAD IMAGE
  // ======================================================

  async function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const files =
      event.target.files;

    if (
      !files ||
      files.length === 0
    ) {
      return;
    }


    setError("");


    const availableSlots =
      maxImages - images.length;


    if (availableSlots <= 0) {
      setError(
        `Maximum ${maxImages} images allowed.`
      );

      event.target.value = "";

      return;
    }


    const selectedFiles =
      Array.from(files).slice(
        0,
        availableSlots
      );


    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
    ];


    for (
      const file of selectedFiles
    ) {
      if (
        !allowedTypes.includes(
          file.type
        )
      ) {
        setError(
          "Only PNG, JPG, JPEG and WEBP images are allowed."
        );

        event.target.value = "";

        return;
      }


      if (
        file.size >
        10 * 1024 * 1024
      ) {
        setError(
          "Each image must be smaller than 10MB."
        );

        event.target.value = "";

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

      event.target.value = "";

      return;
    }


    setUploading(true);


    try {
      const uploadedImages:
        ProductUploadImage[] = [];


      for (
        const file of selectedFiles
      ) {
        const formData =
          new FormData();

        formData.append(
          "image",
          file
        );


        const response =
          await fetch(
            `${API_URL}/api/uploads/product-image`,
            {
              method: "POST",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },

              body: formData,
            }
          );


        const data =
          await response.json();


        if (
          !response.ok ||
          !data.success ||
          !data.image_url
        ) {
          throw new Error(
            data.message ||
              `Unable to upload ${file.name}`
          );
        }


        uploadedImages.push({
          image_url:
            data.image_url,

          alt_text:
            productName.trim() ||
            file.name
              .replace(
                /\.[^/.]+$/,
                ""
              )
              .replace(
                /[-_]/g,
                " "
              ),
        });
      }


      onChange([
        ...images,
        ...uploadedImages,
      ]);
    } catch (uploadError) {
      if (
        uploadError instanceof
        Error
      ) {
        setError(
          uploadError.message
        );
      } else {
        setError(
          "Unable to upload image."
        );
      }
    } finally {
      setUploading(false);

      event.target.value = "";
    }
  }


  // ======================================================
  // REMOVE IMAGE FROM FORM
  // ======================================================

  function removeImage(
    index: number
  ) {
    onChange(
      images.filter(
        (_, imageIndex) =>
          imageIndex !== index
      )
    );
  }


  // ======================================================
  // ALT TEXT
  // ======================================================

  function updateAltText(
    index: number,
    value: string
  ) {
    onChange(
      images.map(
        (image, imageIndex) =>
          imageIndex === index
            ? {
                ...image,
                alt_text: value,
              }
            : image
      )
    );
  }


  // ======================================================
  // UI
  // ======================================================

  return (
    <div>

      <input
        ref={inputRef}
        type="file"
        accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
        multiple
        onChange={
          handleFileChange
        }
        className="hidden"
      />


      {/* UPLOAD AREA */}

      <button
        type="button"
        onClick={
          openFilePicker
        }
        disabled={
          uploading ||
          images.length >=
            maxImages
        }
        className="group flex min-h-[150px] w-full flex-col items-center justify-center border border-dashed border-black/20 bg-black/[0.015] px-6 py-8 text-center transition hover:border-black/45 hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-45"
      >

        {uploading ? (
          <>
            <Loader2
              size={22}
              strokeWidth={1.2}
              className="animate-spin text-black/45"
            />

            <p className="mt-4 text-[9px] font-semibold tracking-[0.15em] uppercase">
              Uploading...
            </p>

            <p className="mt-2 text-[8px] text-black/35">
              Please wait while your
              images are uploaded.
            </p>
          </>
        ) : (
          <>
            <div className="flex h-11 w-11 items-center justify-center border border-black/10 bg-white/40 transition group-hover:bg-black group-hover:text-white">

              <Upload
                size={16}
                strokeWidth={1.3}
              />

            </div>

            <p className="mt-4 text-[9px] font-semibold tracking-[0.14em] uppercase">
              Choose Product Images
            </p>

            <p className="mt-2 max-w-[300px] text-[8px] leading-4 text-black/35">
              PNG, JPG, JPEG or WEBP.
              Maximum 10MB per image.
            </p>

            <p className="mt-3 text-[7px] font-semibold tracking-[0.12em] text-black/30 uppercase">
              {images.length} /{" "}
              {maxImages} images
            </p>
          </>
        )}

      </button>


      {/* ERROR */}

      {error && (
        <div className="mt-3 border border-red-900/15 bg-red-950/[0.04] px-4 py-3">

          <p className="text-[9px] leading-4 text-red-800">
            {error}
          </p>

        </div>
      )}


      {/* IMAGE PREVIEWS */}

      {images.length > 0 && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">

          {images.map(
            (
              image,
              index
            ) => (
              <div
                key={`${image.image_url}-${index}`}
                className="border border-black/10 bg-white/25 p-3"
              >

                {/* IMAGE */}

                <div className="relative aspect-[4/5] overflow-hidden bg-black/[0.035]">

                  <Image
                    src={
                      image.image_url
                    }
                    alt={
                      image.alt_text ||
                      productName ||
                      "Product image"
                    }
                    fill
                    sizes="(max-width: 640px) 100vw, 350px"
                    className="object-cover"
                  />


                  {/* PRIMARY */}

                  {index === 0 && (
                    <span className="absolute left-3 top-3 bg-[#111111] px-2.5 py-1.5 text-[6px] font-semibold tracking-[0.13em] !text-white uppercase">
                      Primary
                    </span>
                  )}


                  {/* DELETE */}

                  <button
                    type="button"
                    onClick={() =>
                      removeImage(
                        index
                      )
                    }
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center bg-white text-black shadow-sm transition hover:bg-red-700 hover:text-white"
                    aria-label="Remove image"
                  >
                    <Trash2
                      size={13}
                      strokeWidth={1.4}
                    />
                  </button>

                </div>


                {/* ALT TEXT */}

                <div className="mt-3">

                  <label className="mb-2 block text-[6px] font-semibold tracking-[0.14em] text-black/35 uppercase">
                    Alt Text
                  </label>

                  <input
                    type="text"
                    value={
                      image.alt_text
                    }
                    onChange={(
                      event
                    ) =>
                      updateAltText(
                        index,
                        event.target.value
                      )
                    }
                    placeholder="Product image description"
                    className="h-[42px] w-full border border-black/10 bg-transparent px-3 text-[9px] outline-none transition placeholder:text-black/25 focus:border-black"
                  />

                </div>

              </div>
            )
          )}

        </div>
      )}


      {/* ADD MORE */}

      {images.length > 0 &&
        images.length <
          maxImages &&
        !uploading && (
          <button
            type="button"
            onClick={
              openFilePicker
            }
            className="mt-4 flex h-[42px] items-center gap-2 border border-black/10 px-4 text-[7px] font-semibold tracking-[0.14em] text-black/45 uppercase transition hover:border-black hover:text-black"
          >
            <Plus
              size={12}
              strokeWidth={1.4}
            />

            Add More Images
          </button>
        )}


      {/* EMPTY HELPER */}

      {images.length === 0 &&
        !uploading && (
          <div className="mt-4 flex items-center gap-2 text-black/30">

            <ImagePlus
              size={12}
              strokeWidth={1.3}
            />

            <p className="text-[7px] tracking-[0.08em]">
              First image will be used
              as the primary product
              image.
            </p>

          </div>
        )}

    </div>
  );
}