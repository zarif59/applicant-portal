<template>
  <div class="flex flex-col h-screen justify-between">
    <header
      class="min-h-14 flex items-center justify-between px-4 md:px-auto md:container md:mx-auto"
    >
      <LayoutNavbar />
    </header>
    <div class="border-b-2" />

    <main class="mb-auto p-4 md:px-auto md:container md:mx-auto">
      <slot />
    </main>
    <footer class="text-sm text-muted-foreground m-1 border-t-2 text-center">
      2025
    </footer>
  </div>
</template>
