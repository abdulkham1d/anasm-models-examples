import React from "react";
import { IoLibraryOutline } from "react-icons/io5";

export default function Topbar({ leftOpen, setLeftOpen }) {
  return (
    <div className="topbar" style={{width:"100%"}}>
      <div className="brand">AnaSM.uz • O'zbek tilidagi odam anatomiyasi</div>
      <div className="muted tiny">Ilmiy o'rganish uchun: aylantirish • zum • 3D modelni ko'rish</div>
      <div style={{width:"100%", display:"flex", flexDirection: "row", justifyContent:"flex-end", alignItems:"center", gap: "10px", flex:1}}>
        {!leftOpen && <button className="btn sm" onClick={()=>setLeftOpen(true)}><span> <IoLibraryOutline /></span> Anatomiya kutubxonasi</button>}
      </div>
    </div>
  );
}
