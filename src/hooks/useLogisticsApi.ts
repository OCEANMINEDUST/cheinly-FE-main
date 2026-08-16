import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";

// This is a simulated hook until the actual cheinly-BE endpoints are ready.
export function useLogisticsApi() {
  const queryClient = useQueryClient();

  // Mock Cancel Pickup
  const cancelPickup = useMutation({
    mutationFn: async ({ orderId }: { orderId: string }) => {
      // Simulate network request with 20% chance of failure to demonstrate retries
      return new Promise<{ success: boolean; orderId: string; message: string }>((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() < 0.2) {
            reject(new Error("Network timeout: Logistics provider did not respond."));
          } else {
            resolve({ success: true, orderId, message: "Pickup cancelled successfully." });
          }
        }, 1500);
      });
    },
    retry: 3, // Retry up to 3 times
    retryDelay: (attempt) => Math.min(attempt * 1000, 3000), // Exponential backoff: 1s, 2s, 3s
    onMutate: () => {
      toast.loading("Communicating with logistics provider...", { id: "cancel-pickup" });
    },
    onSuccess: (data) => {
      toast.success(data.message, { id: "cancel-pickup" });
      // In a real app, we'd invalidate the order/pickup query here
      queryClient.invalidateQueries({ queryKey: ["pickup", data.orderId] });
    },
    onError: (error) => {
      toast.error(`Failed to cancel pickup: ${error.message}`, { id: "cancel-pickup" });
    },
  });

  // Mock Reschedule Pickup
  const reschedulePickup = useMutation({
    mutationFn: async ({ orderId, newTime }: { orderId: string; newTime: string }) => {
      return new Promise<{ success: boolean; orderId: string; message: string }>((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() < 0.2) {
            reject(new Error("Logistics provider API is currently unreachable."));
          } else {
            resolve({ success: true, orderId, message: `Pickup rescheduled to ${newTime}.` });
          }
        }, 1500);
      });
    },
    retry: 3,
    retryDelay: (attempt) => Math.min(attempt * 1000, 3000),
    onMutate: () => {
      toast.loading("Rescheduling pickup window...", { id: "reschedule-pickup" });
    },
    onSuccess: (data) => {
      toast.success(data.message, { id: "reschedule-pickup" });
      queryClient.invalidateQueries({ queryKey: ["pickup", data.orderId] });
    },
    onError: (error) => {
      toast.error(`Rescheduling failed: ${error.message}`, { id: "reschedule-pickup" });
    },
  });

  return { cancelPickup, reschedulePickup };
}
