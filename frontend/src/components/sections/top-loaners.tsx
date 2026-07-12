import { IoInformationSharp } from "react-icons/io5";
import { LuChevronRight } from "react-icons/lu";

export const TopLoaners = () => {
  const products = [
    {
      image: "/loaners/kasente.png",
      name: "Kasente",
      description: "Mobile money loans for SMEs",
      interestRate: "18%",
    },
    {
      image: "/loaners/erase-bg-images.png",
      name: "Quick Sente",
      description: "Instant micro-loans via app",
      interestRate: "24%",
    },
    {
      image: "/loaners/images.png",
      name: "Fido",
      description: "Digital lending platform",
      interestRate: "15%",
    },
    {
      image: "/loaners/numida.jpg",
      name: "Numida",
      description: "Business credit solutions",
      interestRate: "21%",
    },
  ];
  return (
    <section className="max-w-7xl w-7xl h-screen">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-medium mb-4">Top Providers</h2>
        <a
          href="#"
          className="text-sm flex items-center space-x-4 hover:underline"
        >
          <span>View All</span> <LuChevronRight />
        </a>
      </div>
      <div className="grid grid-cols-5 gap-8">
        {products.map((item, index) => (
          <div
            key={index}
            className="border hover:border-black/20 cursor-pointer transition-colors rounded-xl p-2 flex flex-col"
          >
            {/* Top row: badge + bookmark */}
            <div className="flex items-center justify-between mb-2">
              <span className="bg-lime-300 text-neutral-800 text-xs px-2 py-0.5 rounded-full">
                <span className="font-bold">{item.interestRate}</span> interest
              </span>
              <div className="size-7 rounded-full border border-zinc-300 flex items-center justify-center cursor-pointer">
                <IoInformationSharp />
              </div>
            </div>

            {/* Product Image */}
            <div className="flex items-center justify-center h-28 mb-2">
              <img
                src={item.image}
                alt={item.name}
                className="max-h-full max-w-full object-contain rounded-full"
              />
            </div>

            {/* Product Name */}
            <p className="text-lg text-neutral-500 mb-1 px-2 text-center font-semibold">
              {item.name}
            </p>
            <p className="text-sm text-neutral-500 mb-3 px-2 text-center font-light">
              {item.description}
            </p>

            {/* Price */}
            <div className="flex items-center gap-2">
              <button className="border w-full py-2 rounded-md text-sm">
                Get Loan
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
