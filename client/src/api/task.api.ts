import axois, { AxiosError } from "axios"
import type { Filters, Status, TaskPayload } from "@/types"

const API_URL = import.meta.env.VITE_API_URL || "https://localhost:8080/api"

const axiosClient = axois.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

export type AxoisApiError = AxiosError<{
  message: string
  status: "fail" | "error"
}>

function normalizeError(err: AxoisApiError) {
  if (err.response) {
    const { data } = err.response
    const message = data.message || "Something went wrong"
    return new Error(message)
  }
  if (err.request) {
    return new Error("Could not reach the server")
  }
  return new Error(err.message)
}

export const taskapi = {
  async getTasks(params: Partial<Filters>) {
    try {
      const { data } = await axiosClient.get("/tasks", { params })
      return data
    } catch (error) {
      throw normalizeError(error as AxoisApiError)
    }
  },

  async getTaskById(id: string) {
    try {
      const { data } = await axiosClient.get(`/tasks/${id}`)
      return data
    } catch (error) {
      throw normalizeError(error as AxoisApiError)
    }
  },

  async create(payload: TaskPayload) {
    try {
      const { data } = await axiosClient.post("/tasks", payload)
      return data
    } catch (error) {
      throw normalizeError(error as AxoisApiError)
    }
  },

  async update(id: string, payload: TaskPayload) {
    try {
      const { data } = await axiosClient.put(`/tasks/${id}`, payload)
      return data
    } catch (error) {
      throw normalizeError(error as AxoisApiError)
    }
  },

  async updateStatus(id: string, status: Status) {
    try {
      const { data } = await axiosClient.patch(`/tasks/${id}/status`, {
        status,
      })
      return data
    } catch (error) {
      throw normalizeError(error as AxoisApiError)
    }
  },

  async delete(id: string) {
    try {
      const { data } = await axiosClient.delete(`/tasks/${id}`)
      return data
    } catch (error) {
      throw normalizeError(error as AxoisApiError)
    }
  },
}
