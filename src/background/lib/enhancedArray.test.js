import { createEnhancedArray } from './enhancedArray'

test('should use defaults', () => {
  const enhancedArray = createEnhancedArray([{ text: 'Item' }])
  expect(enhancedArray.any).toBeTruthy()
  expect(enhancedArray.last.text).toEqual('Item')
})

test('should add items', () => {
  const enhancedArray = createEnhancedArray()
  expect(enhancedArray.any).toBeFalsy()
  enhancedArray.add({ text: 'New item' })
  expect(enhancedArray.last.text).toEqual('New item')
  enhancedArray.add({ text: 'New item 2' })
  expect(enhancedArray.length).toEqual(2)
  expect(enhancedArray.last.text).toEqual('New item 2')
})

test('should remove items', () => {
  const enhancedArray = createEnhancedArray()
  const itemOne = enhancedArray.add({ text: 'New item' })
  const itemTwo = enhancedArray.add({ text: 'New item 2' })
  expect(enhancedArray.length).toEqual(2)
  enhancedArray.remove(itemOne)
  expect(enhancedArray.length).toEqual(1)
  expect(enhancedArray.last.text).toEqual('New item 2')
  enhancedArray.remove(itemTwo)
  expect(enhancedArray.any).toBeFalsy()
})

test('should allow duplicated removing', () => {
  const enhancedArray = createEnhancedArray()
  const itemOne = enhancedArray.add({ text: 'New item' })
  enhancedArray.add({ text: 'New item 2' })
  enhancedArray.remove(itemOne)
  enhancedArray.remove(itemOne)
  expect(enhancedArray.length).toEqual(1)
})
