import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymsUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'Academia Max Training',
      description: null,
      phone: null,
      latitude: -3.7691748,
      longitude: -38.6095446
    })

    await gymsRepository.create({
      title: 'Academia Top Up Fitness',
      description: null,
      phone: null,
      latitude: -3.7691748,
      longitude: -38.6095446
    })

    const { gyms } = await sut.execute({
      query: 'Max Training',
      page: 1
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Academia Max Training' }),
    ])
  })

  it('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Academia Max Training ${i}`,
        description: null,
        phone: null,
        latitude: -3.7691748,
        longitude: -38.6095446
      })
    }

    const { gyms } = await sut.execute({
      query: 'Academia',
      page: 2
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Academia Max Training 21' }),
      expect.objectContaining({ title: 'Academia Max Training 22' })
    ])
  })
})