
export default function ExploreGrid({ explore, setPrompt }: any) {
  if(!explore?.length) return null;
  return (
    <div>
      <h2 className="text-lg mb-2">Explore</h2>
      <div className="grid grid-cols-2 gap-3">
        {explore.map((e:any)=>(
          <div key={e.id} className="glass">
            <img src={e.image} className="rounded-lg"/>
            <button onClick={()=>setPrompt(e.prompt)} className="w-full text-sm py-2">Remix</button>
          </div>
        ))}
      </div>
    </div>
  );
}
