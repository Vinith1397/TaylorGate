// export default function FooterBar() {
//   return (
//     // <footer className="p-1 text-center pb-2 mt--2 bg-black text-color-white">
//       <footer className="p-1 text-center pb-2 bg-black text-color-white" style={{ marginTop: "-6px" }}>

//       <small>© {new Date().getFullYear()} C2S technolgies Inc • Move freight, not paper.</small>
//     </footer>
//   );
// }

export default function FooterBar() {
  return (
    <footer
      className="p-1 text-center pb-2 bg-black"
      style={{ marginTop: "-6px" , background : "black" }}
    >
      <small style={{color : "white"}}>
        © {new Date().getFullYear()} C2S Technologies Inc • Move freight, not paper.
      </small>
    </footer>
  );
}

