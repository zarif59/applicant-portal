<script setup>
definePageMeta({
  layout: false,
});

const auth = ref({
  email: "employee@gmail.com",
  password: "employee12345",
});

const isLoading = ref(false);
const resMsg = ref("");

const handleLogin = async () => {
  isLoading.value = true;
  resMsg.value = "";
  try {
    await useNuxtApp()
      .$pb.collection("employees")
      .authWithPassword(auth.value.email, auth.value.password);
    navigateTo("/");
  } catch (error) {
    resMsg.value = error.message;
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="w-full lg:flex min-h-screen lg:items-center">
    <div class="flex items-center justify-center py-12 lg:w-1/2">
      <div class="mx-auto grid w-[350px] gap-6">
        <div class="grid gap-2 text-center">
          <h1 class="text-3xl font-bold">Login for Employee</h1>
          <p class="text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        <div class="grid gap-4">
          <div class="grid gap-2">
            <Label for="email">Email</Label>
            <Input v-model="auth.email" id="email" type="email" required />
          </div>
          <div class="grid gap-2">
            <div class="flex items-center">
              <Label for="password">Password</Label>
              <!-- <NuxtLink to="/" class="ml-auto inline-block text-sm underline">
                Forget password?
              </NuxtLink> -->
            </div>
            <Input
              v-model="auth.password"
              id="password"
              type="password"
              required
            />
          </div>
          <Button :disabled="isLoading" @click="handleLogin">
            {{ isLoading ? "Loading..." : "Login" }}</Button
          >
        </div>
        <p v-if="resMsg" class="text-red-500 text-sm mt-2">
          {{ resMsg }}
        </p>
      </div>
    </div>
    <div class="hidden bg-muted lg:block w-/12">
      <NuxtImg
        src="/placeholder.jpeg"
        alt="Image"
        width="960"
        height="1080"
        class="h-screen object-cover"
      />
    </div>
  </div>
</template>
