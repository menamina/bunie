import { useQuery } from "@tanstack/react-query";
import { getProductsQueryOptions } from "../ts-queries/queries";

function SelectedView({ view, whoseProfile }) {
  const viewConfig = {
    inventory: { title: "Inventory", endpoint: "inventory" },
    inprogress: { title: "In Progress", endpoint: "inprogress" },
    limbo: { title: "Limbo", endpoint: "limbo" },
    decluttered: { title: "Decluttered", endpoint: "decluttered" },
    finished: { title: "Finished", endpoint: "finished" },
  };

  const config = viewConfig[view];

  const {
    data: products,
    isPending,
    error,
  } = useQuery(getProductsQueryOptions(config.endpoint, whoseProfile.username));

  if (isPending) {
    return <div>Loading {config.title}...</div>;
  }

  if (error) {
    return (
      <div>
        Error loading {config.title}: {error.message}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return <div>No items in {config.title}</div>;
  }

  return (
    <div className="productViewDIV">
      <h2>{config.title}</h2>
      <div className="productsGrid">
        {products.map((product) => (
          <div key={product.id} className="productCard">
            {product.img && <img src={product.img} alt={product.product} />}
            <div>{product.brand}</div>
            <div>{product.product}</div>
            <div>{product.category}</div>
            <div>${product.price}</div>
            {product.rating && <div>Rating: {product.rating}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SelectedView;
