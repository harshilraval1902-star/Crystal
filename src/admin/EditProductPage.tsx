import React from "react";
import { useParams } from "wouter";
import { ProductEditor } from "@/components/admin/products/ProductEditor";

export default function EditProductPage() {
  const params = useParams();
  const id = params.id ? parseInt(params.id, 10) : undefined;
  
  return <ProductEditor productId={id} />;
}
