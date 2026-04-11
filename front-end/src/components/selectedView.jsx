import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getStatusViewOptions,
  deleteProductMutOpts,
} from "../ts-queries/queries";
import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import EditProduct from "./editProduct";

function SelectedView({ view, whoseProfile }) {
  const { user } = useOutletContext();
  const queryClient = useQueryClient();
  const [openProductDots, setOpenProductDots] = useState(false);
  const [openProductOptions, setOpenProductOptions] = useState(null);

  const [productToEdit, setProductToEdit] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

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
    isPending: viewingProdsPending,
    error: viewProdsError,
  } = useQuery(
    getStatusViewOptions(config.endpoint, whoseProfile.username, user.username),
  );

  const {
    mutate: deleteProductMutation,
    isPending: deletePending,
    error: deleteError,
    reset: resetDelete,
  } = useMutation({
    ...deleteProductMutOpts(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["view-status", whoseProfile.username],
      });
      setProductToDelete(null);
      setOpenProductDots(false);
      setOpenProductOptions(null);
      resetDelete();
    },
  });

  if (viewingProdsPending) {
    return <div>Loading {config.status}...</div>;
  }

  if (viewProdsError) {
    return <div>Error: {viewProdsError.message}</div>;
  }

  if (!products || products.length === 0) {
    return (
      <div>
        No items in {whoseProfile.username}'s {config.status}
      </div>
    );
  }

  function cancelProductOptions(e) {
    e.stopPropagation();
    setOpenProductDots(false);
    setOpenProductOptions(null);
    setProductToDelete(null);
  }

  function cancelEdit(e) {
    e.stopPropagation();
    setProductToEdit(null);
    setOpenProductOptions(null);
  }

  function deleteProduct(product) {
    if (product?.id) {
      deleteProductMutation(product.id);
    }
  }

  return (
    <div className="productViewDIV">
      {openProductOptions === "edit" && (
        <EditProduct product={productToEdit} cancel={cancelEdit} />
      )}

      {openProductOptions === null && (
        <>
          <h2>{config.status}</h2>
          <div>{products.length} items</div>
          <div className="productsGrid">
            {products.map((product) => (
              <div key={product.id} className="productCard">
                {whoseProfile === user.username && (
                  <div>
                    <div onClick={() => setOpenProductDots(true)}>...</div>
                    {openProductDots && (
                      <div onClick={cancelProductOptions}>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setProductToEdit(product);
                            setOpenProductOptions("edit");
                          }}
                        >
                          edit
                        </div>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenProductOptions("delete");
                            setProductToDelete(product.id);
                          }}
                        >
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

                  {product.img && (
                    <img src={product.img} alt={product.product} />
                  )}
                  <div>
                    {product.rating && <div>Rating: {product.rating}</div>}
                    {product.notes && <div>Notes: {product.notes}</div>}
                    {product.wouldBuyAgain && (
                      <div>Repurchase status: {product.wouldBuyAgain}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {openProductOptions === "delete" && (
              <div className="deleteModal" onClick={cancelProductOptions}>
                <div>Delete this item?</div>
                <div>Once you delete this item it cannot be undone </div>
                {!deletePending ? (
                  <div>
                    <div onClick={cancelProductOptions}>cancel</div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProduct(productToDelete);
                      }}
                    >
                      delete
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="cantClick">cancel</div>
                    <div className="cantClick">delete</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default SelectedView;
