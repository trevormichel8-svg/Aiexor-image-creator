
export default function MyCreations({ history, setPrompt, setImage }: any) {
  if(!history.length) return null;
  return (
    <div>
      <h2 className="text-lg mb-2">My Creations</h2>
      <div className="grid grid-cols-2 gap-3">
        {history.map((h:any,i:number)=>(
          <button key={i} onClick={()=>{setPrompt(h.prompt);setImage(h.image);}}>
            <img src={h.image} className="rounded-lg"/>
          </button>
        ))}
      </div>
    </div>
  );
}
