
"use client";
import { useEffect, useState } from "react";
export function useCredits(){
  const [credits,setCredits]=useState<number|null>(null);
  const refresh=()=>fetch("/api/credits").then(r=>r.json()).then(d=>setCredits(d.credits));
  useEffect(()=>{refresh()},[]);
  return {credits,refresh};
}
