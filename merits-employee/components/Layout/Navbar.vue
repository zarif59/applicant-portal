<script setup>
import { SquareUserRound } from "lucide-vue-next";

const handleLogout = async () => {
  const { $pb } = useNuxtApp();
  $pb.authStore.clear();
  navigateTo("/auth/login");
};
</script>

<template>
  <div class="flex justify-between w-full items-center">
    <NuxtLink to="/" class="font-semibold flex items-center gap-2">
      <span>Merits</span>
    </NuxtLink>

    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="secondary" size="icon" class="rounded">
          <SquareUserRound />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{{
          useNuxtApp().$pb.authStore?.record?.name
        }}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem class="cursor-pointer"
          ><NuxtLink to="/security" class="w-full"
            >Security</NuxtLink
          ></DropdownMenuItem
        >
        <DropdownMenuItem class="cursor-pointer" @click="handleLogout"
          >Logout</DropdownMenuItem
        >
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
