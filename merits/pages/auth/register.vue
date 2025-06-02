<script setup>
definePageMeta({
  layout: false,
});

const data = {
  email: "test@example.com",
  emailVisibility: false,
  name: "test",
  password: "12345678",
  passwordConfirm: "12345678",
};

const isLoading = ref(false);
const resMsg = ref("");
const isError = ref(false);

const handleRegister = async () => {
  isLoading.value = true;
  resMsg.value = "";
  try {
    await useNuxtApp().$pb.collection("users").create(data);
    isLoading.value = false;
    isError.value = false;
    resMsg.value = "Registration successful! Please login to your account.";
    await new Promise((resolve) => setTimeout(resolve, 5000));
    navigateTo("/auth/login");
  } catch (error) {
    resMsg.value = error.message;
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};

const isRegisterFormVisible = ref(false);
const identity_cardValue = ref("");

const isLoadingCheck = ref(false);
const resMsgCheck = ref("");
const isErrorCheck = ref(false);

const handleCheckExistingAccount = async () => {
  isLoadingCheck.value = true;
  resMsgCheck.value = "";
  try {
    const user = await useNuxtApp()
      .$pb.collection("personal_data")
      .getFirstListItem(`identity_card="${identity_cardValue.value}"`, {
        expand: "user",
      });
    isLoadingCheck.value = false;
    isErrorCheck.value = true;
    resMsgCheck.value = `Account already exists for ${identity_cardValue.value}. Please login.`;
  } catch (error) {
    resMsgCheck.value = "Please register to create an account.";
    isErrorCheck.value = false;
    isRegisterFormVisible.value = true;
  } finally {
    isLoadingCheck.value = false;
  }
};
</script>

<template>
  <div class="flex flex-col gap-4 min-h-screen items-center justify-center">
    <Card class="mx-auto w-sm">
      <CardHeader>
        <CardTitle class="text-xl"> Check for Existing Account </CardTitle>
        <CardDescription> Fill below to proceed </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4">
          <div class="grid gap-2">
            <Label for="first-name"> Identity Card Number </Label>
            <Input id="first-name" v-model="identity_cardValue" required />
          </div>
          <Button
            type="submit"
            :disabled="isLoadingCheck"
            @click="handleCheckExistingAccount"
          >
            {{ isLoadingCheck ? "Loading..." : "Check" }}</Button
          >
          <p
            v-if="resMsgCheck"
            :class="isErrorCheck ? 'text-red-500' : 'text-green-500'"
            class="w-[300px] break-words sm:w-full"
          >
            {{ resMsgCheck }}
          </p>
        </div>
      </CardContent>
    </Card>

    <Separator v-if="isRegisterFormVisible" class="my-2 max-w-80" />

    <Card class="mx-auto w-sm" v-if="isRegisterFormVisible">
      <CardHeader>
        <CardTitle class="text-xl"> Register </CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4">
          <div class="grid gap-2">
            <Label for="first-name">Who do we call you?</Label>
            <Input id="first-name" v-model="data.name" required />
          </div>
          <div class="grid gap-2">
            <Label for="email">Email</Label>
            <Input id="email" type="email" v-model="data.email" required />
          </div>
          <div class="grid gap-2">
            <Label for="password">Password</Label>
            <Input id="password" type="password" v-model="data.password" />
          </div>
          <div class="grid gap-2">
            <Label for="password">Confirm Password</Label>
            <Input
              id="password"
              type="password"
              v-model="data.passwordConfirm"
            />
          </div>
          <Button type="submit" :disabled="isLoading" @click="handleRegister">
            {{ isLoading ? "Loading..." : "Register" }}</Button
          >
          <p
            v-if="resMsg"
            :class="isError ? 'text-red-500' : 'text-green-500'"
            class="w-[300px] break-words sm:w-full"
          >
            {{ resMsg }}
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
