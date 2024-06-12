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
      createdAt: Date;
      email: string;
      firstName: string;
      fullName: string;
      id: string;
      lastName: string;
      password: string;
      role: UserRoles.OWNER;
      updatedAt: Date;
    }
  | {
      createdAt: Date;
      device: string;
      id: string;
      name: string;
      refreshTokenId: string;
      role: UserRoles.GUEST;
      updatedAt: Date;
    };
