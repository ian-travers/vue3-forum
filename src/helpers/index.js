export const findById = (resource, id) => {
  if (!resource) return null

  return resource.find(r => r.id === id)
}

export const upsert = (resources, resource) => {
  const index = resources.findIndex(r => r.id === resource.id)

  if (resource.id && index !== -1) {
    resources[index] = resource
  } else {
    resources.push(resource)
  }
}
