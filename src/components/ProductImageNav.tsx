interface ProductImageNavProps {
  total: number;
  onPrevious: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onNext: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const ProductImageNav = ({ total, onPrevious, onNext }: ProductImageNavProps) => {
  if (total <= 1) return null;

  const buttonClass =
    "absolute top-1/2 z-20 flex h-14 w-9 -translate-y-1/2 items-center justify-center bg-transparent text-[30px] font-light leading-none text-charcoal/75 drop-shadow-[0_1px_3px_rgba(250,248,245,0.72)] transition-[color,opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-charcoal focus:outline-none md:opacity-0 md:group-hover/image:opacity-100";

  return (
    <>
      <button
        type="button"
        className={`${buttonClass} left-1 hover:-translate-x-0.5`}
        onClick={onPrevious}
        aria-label="Previous product image"
      >
        &lt;
      </button>
      <button
        type="button"
        className={`${buttonClass} right-1 hover:translate-x-0.5`}
        onClick={onNext}
        aria-label="Next product image"
      >
        &gt;
      </button>
    </>
  );
};

export default ProductImageNav;
