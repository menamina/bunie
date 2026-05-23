import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getStatusViewOptions,
  deleteProductMutOpts,
} from "../ts-queries/queries";
import { useOutletContext } from "react-router-dom";
import { useState, Fragment } from "react";
import AddToInventory from "./addToInventory";

import "../css/selectedView.css";

function SelectedView({ view, whoseProfile }) {
  const { user } = useOutletContext();
  const queryClient = useQueryClient();
  const [openProductDots, setOpenProductDots] = useState(null);
  const [openProductOptions, setOpenProductOptions] = useState(null);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

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
  } = useQuery(getStatusViewOptions(config.endpoint, whoseProfile));

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
    if (e) {
      e.stopPropagation();
    }
    setOpenProductDots(null);
    setOpenProductOptions(null);
    setProductToEdit(null);
    setProductToDelete(null);
  }

  return (
    <div className="productViewDIV">
      {viewingProdsPending && <div className="centerError">Loading...</div>}
      {viewProdsError && (
        <div className="centerError">Error: {viewProdsError?.message}</div>
      )}

      {products?.inventory && (
        <div>
          <div className="view and item count">
            <h2>{config.status}</h2>
            {products?.inventory.length === 0 && (
              <div className="centerError">Nothing to see here</div>
            )}
            {products?.inventory.length === 1 && <div>1 item</div>}
            {products?.inventory.length > 1 && (
              <div>{products?.inventory.length} items</div>
            )}
          </div>
          <div className="productsGrid">
            {products?.inventory.map((product) => (
              <Fragment key={`${product?.id} viewProd`}>
                <div className="productCard">
                  {whoseProfile === user.username && (
                    <div className="deletedProduct">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          if (openProductDots === product?.id) {
                            setOpenProductDots(null);
                          } else {
                            setModalPosition({
                              x: e.clientX - 140,
                              y: e.clientY - 30,
                            });
                            setOpenProductDots(product?.id);
                          }
                        }}
                        className="dltDots"
                      >
                        ...
                      </div>
                      {openProductDots === product?.id && (
                        <div
                          className="deleteModalFixed"
                          onClick={(e) => {
                            e.stopPropagation();
                            cancelProductOptions(e);
                          }}
                        >
                          <div
                            className="deleteModal"
                            style={{
                              left: `${modalPosition.x}px`,
                              top: `${modalPosition.y}px`,
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenProductDots(null);
                                setProductToEdit(product?.id);
                                setOpenProductOptions("edit");
                              }}
                            >
                              edit
                            </div>
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenProductDots(null);
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
                    {product.img && (
                      <div className="productIMGDiv">
                        <img
                          src={`http://localhost:5555/IMGS-API/${product?.img}`}
                          alt={`${products?.product} by ${product.brand}`}
                          className="productIMG"
                        />
                      </div>
                    )}
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
                    <div className="optionalInventoryInfo">
                      {product?.purchaseDate && (
                        <div>{product.purchaseDate}</div>
                      )}
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
                    <div
                      className="confirmDeletePostModal"
                      onClick={(e) => {
                        e.stopPropagation();
                        cancelProductOptions(e);
                      }}
                    >
                      <div className="deleteMiniModal">
                        <div>Delete this item?</div>
                        <div className="dltCantBeUndone">
                          Once you delete this item it cannot be undone
                        </div>
                        {!deletePending ? (
                          <div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                cancelProductOptions(e);
                              }}
                            >
                              cancel
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteProductMutation(product?.id);
                              }}
                            >
                              delete
                            </button>
                          </div>
                        ) : (
                          <div>
                            <button type="button" className="cantClick">
                              cancel
                            </button>
                            <button type="button" className="cantClick">
                              delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                {openProductOptions === "edit" &&
                  productToEdit === product.id && (
                    <AddToInventory
                      closeInventoryModal={cancelProductOptions}
                      product={product}
                      user={user}
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
