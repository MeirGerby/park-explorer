import { useState } from "react"

export function useParkFilters() {
  const [search, setSearch] = useState("")
  const [regionId, setRegionId] = useState("")
  const [cityId, setCityId] = useState("")

  function handleRegionChange(value: string) {
    setRegionId(value)
    setCityId("")
  }

  function clearFilters() {
    setSearch("")
    setRegionId("")
    setCityId("")
  }

  return {
    search,
    regionId,
    cityId,
    setSearch,
    setCityId,
    handleRegionChange,
    clearFilters,
  }
}