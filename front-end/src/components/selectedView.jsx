import { useQuery } from "@tanstack/react-query";
import { getStatusViewOptions } from "../ts-queries/queries";
import { useOutletContext } from "react-router-dom";

function SelectedView({ view, whoseProfile }) {
  const { user } = useOutletContext();

  const viewSelection = {
    inventory: { title: "Inventory", endpoint: "inventory" },
    inprogress: { title: "In Progress", endpoint: "in-progress" },
    limbo: { title: "Limbo", endpoint: "limbo" },
    decluttered: { title: "Decluttered", endpoint: "decluttered" },
    finished: { title: "Finished", endpoint: "finished" },
  };

  const config = viewSelection[view];

  const {
    data: products,
    isPending,
    error,
  } = useQuery(
    getStatusViewOptions(config.endpoint, whoseProfile.username, user.username),
  );

  if (isPending) {
    return <div>Loading {config.title}...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!products || products.length === 0) {
    return (
      <div>
        No items in {whoseProfile.username}'s {config.title}
      </div>
    );
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
