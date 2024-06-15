import { useQuery } from "data_layer/hooks/useQuery";
import { UserRoles } from "types/user";

export const useUserProfileQuery = (props?: { enabled: boolean }) => {
  const { data, error, isLoading } = useQuery<UserProfileResponse | undefined>("user/profile", {
    refetchOnMount: false,
    networkMode: "offlineFirst",
    refetchOnReconnect: false,
    enabled: props?.enabled,
  });

  return { data, error, isLoading };
};

type UserProfileResponse =
  | {
      avatarColor: string;
      email: string;
      fullName: string;
      Homes: {
        id: string;
        name: string;
      }[];
      id: string;
      role: UserRoles.OWNER;
    }
  | {
      avatarColor: string;
      fullName: string;
      Homes: {
        id: string;
        name: string;
      }[];
      id: string;
      role: UserRoles.GUEST;
    };
