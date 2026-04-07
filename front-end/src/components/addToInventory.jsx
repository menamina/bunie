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
    e.preventDefault;
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
          <div className="">
            <label htmlFor=""></label>
            <input type="text" value="" onChange={() => {}} />
          </div>
          <div className="">
            <label htmlFor=""></label>
            <input type="text" value="" onChange={() => {}} />
          </div>
          <div className="">
            <label htmlFor=""></label>
            <input type="text" value="" onChange={() => {}} />
          </div>
          <div className="">
            <label htmlFor=""></label>
            <input type="text" value="" onChange={() => {}} />
          </div>
          <div className="">
            <label htmlFor=""></label>
            <input type="text" value="" onChange={() => {}} />
          </div>
          <div className="">
            <label htmlFor=""></label>
            <input type="text" value="" onChange={() => {}} />
          </div>
          <div className="">
            <label htmlFor=""></label>
            <input type="text" value="" onChange={() => {}} />
          </div>
          <div className="">
            <label htmlFor=""></label>
            <input type="text" value="" onChange={() => {}} />
          </div>
          <div className="">
            <label htmlFor=""></label>
            <input type="text" value="" onChange={() => {}} />
          </div>
          <div className="">
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
