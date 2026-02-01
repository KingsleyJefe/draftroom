import { useQuery } from "@tanstack/react-query";

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      return {
        name: "RM Studios",
        space: "development",
        email: "info@rapid-minds.com",
      };
    },
  });
};
