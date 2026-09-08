import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import ProductDetails from "@/components/product/ProductDetails";
import ProductCard from "@/components/shop/ProductCard";

import {
  getProductById,
  getProducts,
} from "@/lib/products-api";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { id } = await params;

  const productId =
    Number(id);

  if (
    Number.isNaN(productId)
  ) {
    notFound();
  }

  const product =
    await getProductById(
      productId
    );

  if (!product) {
    notFound();
  }

  const allProducts =
    await getProducts();

  const relatedProducts =
    allProducts
      .filter(
        (item) =>
          item.category?.id ===
            product.category?.id &&
          item.id !== product.id
      )
      .slice(0, 4);

  return (
    <main className="min-h-screen bg-[#fafaf8]">

      <AnnouncementBar />
      <Navbar />

      <section className="px-5 pt-8 md:px-8 md:pt-10 lg:px-12">

        <div className="mx-auto max-w-[1440px]">

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-[9px] font-semibold tracking-[0.16em] text-[#063b63] uppercase transition-opacity hover:opacity-50"
          >
            <ArrowLeft
              size={14}
              strokeWidth={1.5}
            />

            Back to shop
          </Link>

        </div>

      </section>

      <section className="px-5 py-10 md:px-8 md:py-16 lg:px-12">

        <div className="mx-auto max-w-[1440px]">

          <ProductDetails
            product={product}
          />

        </div>

      </section>

      {relatedProducts.length > 0 && (
        <section className="bg-white px-5 py-20 md:px-8 md:py-28 lg:px-12">

          <div className="mx-auto max-w-[1440px]">

            <div className="mb-10 md:mb-14">

              <p className="mb-3 text-[10px] font-semibold tracking-[0.28em] text-[#0877b5] uppercase">
                You may also like
              </p>

              <h2 className="font-serif text-4xl tracking-[-0.02em] text-[#022a46] md:text-5xl">
                More from ostren
              </h2>

            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-4 md:gap-x-5">

              {relatedProducts.map(
                (
                  relatedProduct
                ) => (
                  <ProductCard
                    key={
                      relatedProduct.id
                    }
                    product={
                      relatedProduct
                    }
                  />
                )
              )}

            </div>

          </div>

        </section>
      )}

      <Footer />

    </main>
  );
}