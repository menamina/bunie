import { useState } from "react";

function AddToInventory({ closeInventoryModal }) {
  const [postData, setPostData] = useState({
    brand: "",
    product: "",
    category: "",
    price: "",
    img: "",
    status: "",
    backup: "",
    purchaseDate: "",
    rating: "",
    notes: "",
    wouldBuyAgain: "",
  });

  function addToInventory(e) {
    e.preventDefault();
    closeInventoryModal(false);
    setPostData({
      brand: "",
      product: "",
      category: "",
      price: "",
      img: "",
      status: "",
      backup: "",
      purchaseDate: "",
      rating: "",
      notes: "",
      wouldBuyAgain: "",
    });
  }

  return (
    <div
      className="addToInventoryModal"
      onClick={(e) => {
        e.stopPropagation();
        closeInventoryModal(false);
      }}
    >
      <form onSubmit={addToInventory}>
        <div>
          <div className="brand">
            <label htmlFor=""></label>
            <input type="text" value="" onChange={() => {}} />
          </div>
          <div className="product">
            <label htmlFor=""></label>
            <input type="text" value="" onChange={() => {}} />
          </div>
          <div className="category">
            <label htmlFor=""></label>
            <input type="text" value="" onChange={() => {}} />
          </div>
          <div className="price">
            <label htmlFor=""></label>
            <input type="text" value="" onChange={() => {}} />
          </div>
          <div className="img">
            <label htmlFor=""></label>
            <input type="text" value="" onChange={() => {}} />
          </div>
          <div className="status">
            <label htmlFor=""></label>
            <input type="text" value="" onChange={() => {}} />
          </div>
          <div className="backup">
            <label htmlFor=""></label>
            <input type="text" value="" onChange={() => {}} />
          </div>
          <div className="purchaseDate">
            <label htmlFor=""></label>
            <input type="text" value="" onChange={() => {}} />
          </div>
          <div className="rating">
            <label htmlFor=""></label>
            <input type="text" value="" onChange={() => {}} />
          </div>
          <div className="notes">
            <label htmlFor=""></label>
            <input type="text" value="" onChange={() => {}} />
          </div>
          <div className="wouldBuyAgain">
            <label htmlFor=""></label>
            <input type="text" value="" onChange={() => {}} />
          </div>
        </div>
        <div>
          <button className="">add</button>
          <div
            className=""
            onClick={() => {
              setPostData({
                brand: "",
                product: "",
                category: "",
                price: "",
                img: "",
                status: "",
                backup: "",
                purchaseDate: "",
                rating: "",
                notes: "",
                wouldBuyAgain: "",
              });
              closeInventoryModal(false);
            }}
          >
            cancel
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddToInventory;
