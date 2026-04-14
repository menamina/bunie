import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getStatusViewOptions,
  deleteProductMutOpts,
} from "../ts-queries/queries";
import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import AddToInventory from "./addToInventory";

function SelectedView({ view, whoseProfile }) {
  const { user } = useOutletContext();
  const queryClient = useQueryClient();
  const [openProductDots, setOpenProductDots] = useState(null);
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
    getStatusViewOptions(config.endpoint, whoseProfile, user.username),
  );

  const {
    mutate: deleteProductMutation,
    isPending: deletePending,
    reset: resetDelete,
  } = useMutation({
    ...deleteProductMutOpts(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["view-status", whoseProfile],
      });
      setProductToDelete(null);
      setOpenProductDots(null);
      setOpenProductOptions(null);
      resetDelete();
    },
  });

  function cancelProductOptions(e) {
    e.stopPropagation();
    setOpenProductDots(null);
    setOpenProductOptions(null);
    setProductToDelete(null);
    setProductToEdit(null);
  }

  return (
    <div className="productViewDIV">
      {viewingProdsPending && <div>Loading...</div>}
      {viewProdsError && <div>Error: {viewProdsError.message}</div>}
      {products?.length === 0 && <div>Nothing to see here</div>}
      {products?.length > 0 && (
        <div>
          <h2>{config.status}</h2>
          <div>{products.length} items</div>
          <div className="productsGrid">
            {products.map((product) => (
              <>
                <div key={product.id} className="productCard">
                  {whoseProfile === user.username && (
                    <div>
                      <div onClick={() => setOpenProductDots(product.id)}>
                        ...
                      </div>
                      {openProductDots === product.id && (
                        <div onClick={cancelProductOptions}>
                          <div>
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                setProductToEdit(product.id);
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

                {openProductOptions === "delete" &&
                  productToDelete === product.id && (
                    <div className="deleteModal" onClick={cancelProductOptions}>
                      <div>Delete this item?</div>
                      <div>Once you delete this item it cannot be undone </div>
                      {!deletePending ? (
                        <div>
                          <div onClick={cancelProductOptions}>cancel</div>
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteProductMutation(product.id);
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

                {openProductOptions === "edit" &&
                  productToEdit === product.id && (
                    <AddToInventory
                      closeInventoryModal={cancelProductOptions}
                      product={product}
                    />
                  )}
              </>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SelectedView;
