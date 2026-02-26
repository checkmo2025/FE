"use client";

import { clubService } from "@/services/clubService";
import { imageService } from "@/services/imageService";
import { CreateClubRequest } from "@/types/groups/clubCreate";
import { useMutation } from "@tanstack/react-query";


export const useUploadClubImageMutation = () => {
  return useMutation({
    mutationFn: (file: File) => imageService.uploadClubImage(file),
  });
};

export const useCreateClubMutation = () => {
  return useMutation({
    mutationFn: (payload: CreateClubRequest) => clubService.createClub(payload),
  });
};