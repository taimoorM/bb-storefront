import { useQuery } from "@tanstack/react-query";

export const fetchData = async (key: string, headers: {}) => {
  const res = await fetch(`/api/storefront/${key}`, { headers });
  return res.json();
};

export const useTypes = (headers: {}) => {
  return useQuery({
    queryKey: ["types"],
    queryFn: async () => {
      return fetchData("types", headers);
    },
  });
};

export const useCategories = (headers: {}) => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      return fetchData("categories", headers);
    },
  });
};

export const useBrands = (headers: {}) => {
  return useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      return fetchData("brands", headers);
    },
  });
};

export const useSession = (headers: {}) => {
  return useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      return fetchData("session", headers);
    },
  });
};

export const useInventory = (headers: {}) => {
  return useQuery({
    queryKey: ["inventory"],
    queryFn: async () => {
      return fetchData("inventory", headers);
    },
  });
};
