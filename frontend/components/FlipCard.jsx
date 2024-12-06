import React from 'react'

const FlipCard = () => {
  return (
    <div class="flex min-h-screen items-center justify-center bg-slate-100">
  <div class="group h-96 w-80 [perspective:1000px]">
    <div class="relative h-full w-full rounded-xl shadow-xl transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
      <div class="absolute inset-0">
        <img class="h-full w-full rounded-xl object-cover shadow-xl shadow-black/40" src="https://images.unsplash.com/photo-1562583489-bf23ec64651d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80')" alt="" />
      </div>
      <div class="absolute inset-0 h-full w-full rounded-xl bg-black/80 px-12 text-center text-slate-200 [transform:rotateY(180deg)] [backface-visibility:hidden]">
        <div class="flex min-h-full flex-col items-center justify-center">
          <h1 class="text-3xl font-bold">Jane Doe</h1>
          <p class="text-lg">Photographer & Art</p>
          <p class="text-base">Lorem ipsum dolor sit amet consectetur adipisicing.</p>
          <button class="mt-2 rounded-md bg-neutral-800 py-1 px-2 text-sm hover:bg-neutral-900">Read More</button>
        </div>
      </div>
    </div>
  </div>
  <div class="fixed bottom-6">
    <p class="text-lg font-semibold text-neutral-800">All Images are from <a href="https://unsplash.com" class="text-blue-600">Unsplash.com</a></p>
    <p class="text-lg font-semibold text-neutral-800">Visit <a href="https://beyondbuilder.io" class="text-blue-600">BeyondBuilder.io</a> to get more Tailwind CSS UI Components.</p>
  </div>
</div>

  )
}

export default FlipCard