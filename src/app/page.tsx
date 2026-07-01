import Image from "next/image";
import Link from "next/link";
import { Sparkles, Store, ArrowRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const paths = [
  {
    href: "/auth/signup/curator",
    icon: Sparkles,
    title: "I'm a Curator",
    description:
      "Build a storefront around your taste. Pick pieces from certified brands, tell customers why you love them, and earn commission on every sale.",
    bullets: [
      "No inventory or logistics to manage",
      "Set your own commission on each product",
      "Your own branded storefront, your own words",
    ],
    cta: "Become a Curator",
  },
  {
    href: "/auth/signup/brand",
    icon: Store,
    title: "I'm a Brand",
    description:
      "Get certified on CurateCo and let curators introduce your pieces to audiences who already trust their taste.",
    bullets: [
      "Reach customers through trusted curators",
      "You control pricing, stock, and approvals",
      "Track every order from one dashboard",
    ],
    cta: "Register a Brand",
  },
];

const curators = [
  {
    name: "Amara",
    niche: "Quiet Luxury Edit",
    photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80",
  },
  {
    name: "Tunde",
    niche: "Streetwear Staples",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
  },
  {
    name: "Zainab",
    niche: "Minimalist Wardrobe",
    photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80",
  },
  {
    name: "Kelechi",
    niche: "Vintage Finds",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
  },
];

const storePreviewProducts = [
  {
    name: "T-Shirt Short",
    price: "₦71,500",
    photo: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80",
  },
  {
    name: "Short-Sleeved Shirt",
    price: "₦79,200",
    photo: "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=400&q=80",
  },
  {
    name: "Sleeved Shirt with Inner",
    price: "₦63,800",
    photo: "https://images.unsplash.com/photo-1602810318660-d2c46b750f88?w=400&q=80",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-6 py-6 sm:px-12">
        <Image src="/logo.svg" alt="CurateCo" width={140} height={35} priority className="brightness-0 invert" />
        <Link href="/auth/login" className="text-sm font-medium text-white hover:text-white/80">
          Log In
        </Link>
      </header>

      <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-6 text-center sm:px-12">
        <Image
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80"
          alt=""
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70" />
        <div className="absolute inset-0 bg-brand/20" />
        <div className="relative">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-white/90">
            Africa&apos;s Creator Commerce Platform
          </p>
          <h1 className="max-w-3xl font-display text-4xl font-medium leading-tight text-white sm:text-6xl">
            Turn Your Taste Into a Storefront
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-white/85 sm:text-lg">
            Curators build mini storefronts from certified brands and earn commission on every
            sale. Brands reach new customers through creators who already have their trust.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/auth/signup/curator">
              <Button size="lg">Become a Curator</Button>
            </Link>
            <Link href="/auth/signup/brand">
              <Button
                size="lg"
                variant="secondary"
                className="border-white text-white hover:bg-white/10"
              >
                Register a Brand
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20 sm:px-12">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="font-display text-2xl font-medium text-[#1A1A1A] sm:text-3xl">
            Meet the Curators
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-text-secondary sm:text-base">
            Every storefront is shaped by one person&apos;s eye for what&apos;s worth wearing.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {curators.map((curator) => (
              <div key={curator.name} className="flex flex-col items-center">
                <div className="relative size-24 overflow-hidden rounded-full border-2 border-brand-pale sm:size-28">
                  <Image
                    src={curator.photo}
                    alt={curator.name}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </div>
                <p className="mt-4 font-display text-lg font-medium text-[#1A1A1A]">
                  {curator.name}
                </p>
                <p className="text-xs text-text-muted">{curator.niche}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-beige px-6 py-20 sm:px-12">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="font-display text-2xl font-medium text-[#1A1A1A] sm:text-3xl">
            Inside a CurateCo Store
          </h2>
          <p className="mt-3 text-sm text-text-secondary sm:text-base">
            A storefront built entirely around one curator&apos;s taste — their words, their
            picks, their commission.
          </p>
        </div>
        <Card className="mx-auto mt-10 max-w-lg overflow-hidden p-0">
          <div className="relative h-48">
            <Image
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80"
              alt="Storefront preview"
              fill
              sizes="512px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/70" />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-5">
              <p className="font-display text-2xl italic text-white">Curated by Amara</p>
              <span className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[#1A1A1A]">
                <Eye className="size-3.5" />
                Preview
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-px bg-border">
            {storePreviewProducts.map((product) => (
              <div key={product.name} className="bg-white p-3">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-beige">
                  <Image
                    src={product.photo}
                    alt={product.name}
                    fill
                    sizes="170px"
                    className="object-cover"
                  />
                </div>
                <p className="mt-2 line-clamp-1 text-xs font-medium text-[#1A1A1A]">
                  {product.name}
                </p>
                <p className="text-xs text-text-muted">{product.price}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="bg-white px-6 py-20 sm:px-12">
        <h2 className="text-center font-display text-2xl font-medium text-[#1A1A1A] sm:text-3xl">
          How do you want to join?
        </h2>
        <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2">
          {paths.map((path) => (
            <Card key={path.href} className="flex flex-col p-8">
              <div className="flex size-12 items-center justify-center rounded-full bg-brand-pale">
                <path.icon className="size-6 text-brand" />
              </div>
              <h3 className="mt-5 font-display text-xl font-medium text-[#1A1A1A]">
                {path.title}
              </h3>
              <p className="mt-2 text-sm text-text-secondary">{path.description}</p>
              <ul className="mt-5 flex flex-1 flex-col gap-2.5">
                {path.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2 text-sm text-text-secondary">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand" />
                    {bullet}
                  </li>
                ))}
              </ul>
              <Link href={path.href} className="mt-6">
                <Button className="w-full">
                  {path.cta}
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
