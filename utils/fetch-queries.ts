import { useQuery } from "@tanstack/react-query";

export const fetchData = async (key: string, headers: {}) => {
  console.log("inside fetch data", headers);
  const res = await fetch(`/api/storefront/${key}`, { headers });
  return res.json();
};

export const getInitialQueries = (headers: {}) => {
  return [
    {
      queryKey: ["types"],
      queryFn: async () => fetchData("types", headers),
    },
    {
      queryKey: ["categories"],
      queryFn: async () => fetchData("categories", headers),
    },
    {
      queryKey: ["brands"],
      queryFn: async () => fetchData("brands", headers),
    },
    {
      queryKey: ["session"],
      queryFn: async () => fetchData("session", headers),
    },
    {
      queryKey: ["inventory"],
      queryFn: async () => fetchData("inventory", headers),
    },
  ];
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
