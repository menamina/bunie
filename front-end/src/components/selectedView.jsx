import { useQuery } from "@tanstack/react-query";
import { getStatusViewOptions } from "../ts-queries/queries";
import { useOutletContext } from "react-router-dom";
import { useState } from "react";

function SelectedView({ view, whoseProfile }) {
  const { user } = useOutletContext();
  const [openProductDots, setOpenProductDots] = useState(false);
  const [openProductOptions, setOpenProductOptions] = useState(null);

  const [updateThisProduct, setUpdateProduct] = useState({});

  const viewSelection = {
    inventory: { status: "Inventory", endpoint: "inventory" },
    inprogress: { status: "In Progress", endpoint: "in-progress" },
    limbo: { status: "Limbo", endpoint: "limbo" },
    decluttered: { status: "Decluttered", endpoint: "decluttered" },
    finished: { status: "Finished", endpoint: "finished" },
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
    return <div>Loading {config.status}...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!products || products.length === 0) {
    return (
      <div>
        No items in {whoseProfile.username}'s {config.status}
      </div>
    );
  }

  function cancelProductOptions(e) {
    e.preventDefault();
    setOpenProductDots(false);
  }

  return (
    <div className="productViewDIV">
      <h2>{config.status}</h2>
      <div>{products.length} items</div>
      <div className="productsGrid">
        {products.map((product) => (
          <div key={product.id} className="productCard">
            {openProductOptions === null && 
            {whoseProfile === user.username && (
              <div>
                <div onClick={() => setOpenProductDots(true)}>...</div>
                {openProductDots && (
                  <div onClick={cancelProductOptions}>
                    <div onClick={() => setOpenProductOptions("edit")}>
                      edit
                    </div>
                    <div onClick={() => setOpenProductOptions("delete")}>
                      delete
                    </div>
                  </div>
                )}
              </div>
            )}

            <div>
              <div>
                <div>
                  <div>{product.product} by</div>
                  <div>{product.brand}</div>
                </div>
                <div>
                  <div>{product.category}</div>
                  <div>${product.price}</div>
                </div>
              </div>

              {product.img && <img src={product.img} alt={product.product} />}
              <div>
                {product.rating && <div>Rating: {product.rating}</div>}
                {product.notes && <div>Notes: {product.notes}</div>}
                {product.wouldBuyAgain && (
                  <div>Repurchase status: {product.wouldBuyAgain}</div>
                )}
              </div>
            </div>
        }

            {openProductOptions === "edit" && (
              <EditProduct
                product={product}
                nullProductOptions={setOpenProductOptions}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SelectedView;
