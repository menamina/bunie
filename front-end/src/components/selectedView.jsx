import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getStatusViewOptions,
  deleteProductMutOpts,
} from "../ts-queries/queries";
import { useOutletContext } from "react-router-dom";
import { useState, Fragment } from "react";
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

  // if in inventory filter entire enventory by year, category etc etc

  // same for decluttered and finished

  // need to figure why component not in ui

  const config = viewSelection[view];

  const {
    data: products,
    isPending: viewingProdsPending,
    error: viewProdsError,
  } = useQuery(
    getStatusViewOptions(config.endpoint, whoseProfile, user.username),
  );

  if (products) {
    console.log(products);
  }

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
      {viewProdsError && <div>Error: {viewProdsError?.message}</div>}
      {products?.inventorylength === 0 && <div>Nothing to see here</div>}
      {products?.inventory.length > 0 && (
        <div>
          <h2>{config.status}</h2>
          <div>{products?.inventory.length} items</div>
          <div className="productsGrid">
            {products?.inventory.map((product) => (
              <Fragment key={`${product?.id} viewProd`}>
                <div className="productCard">
                  {whoseProfile === user.username && (
                    <div>
                      <div onClick={() => setOpenProductDots(product?.id)}>
                        ...
                      </div>
                      {openProductDots === product?.id && (
                        <div onClick={cancelProductOptions}>
                          <div>
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                setProductToEdit(product?.id);
                                setOpenProductOptions("edit");
                              }}
                            >
                              edit
                            </div>
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenProductOptions("delete");
                                setProductToDelete(product?.id);
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
                        <div>{product?.product} by</div>
                        <div>{product.brand}</div>
                      </div>
                      <div>
                        <div>{product?.category}</div>
                        <div>${product?.price}</div>
                      </div>
                    </div>

                    {product.img && (
                      <img
                        src={`http://localhost:5555/IMGS-API/${product?.img}`}
                        alt={`${products?.product} by ${product.brand}`}
                      />
                    )}
                    <div>
                      {product?.rating && <div>Rating: {product?.rating}</div>}
                      {product?.notes && <div>Notes: {product?.notes}</div>}
                      {product?.wouldBuyAgain && (
                        <div>Repurchase status: {product?.wouldBuyAgain}</div>
                      )}
                    </div>
                  </div>
                </div>

                {openProductOptions === "delete" &&
                  productToDelete === product?.id && (
                    <div className="deleteModal" onClick={cancelProductOptions}>
                      <div>Delete this item?</div>
                      <div>Once you delete this item it cannot be undone </div>
                      {!deletePending ? (
                        <div>
                          <div onClick={cancelProductOptions}>cancel</div>
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteProductMutation(product?.id);
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
              </Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SelectedView;
