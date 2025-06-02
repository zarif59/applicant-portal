<script setup>
const personalData = ref(null);
const error = ref(null);
const applicationStatus = ref("");

onMounted(async () => {
  try {
    const userId = useNuxtApp().$pb.authStore?.record?.id;
    const record = await useNuxtApp()
      .$pb.collection("personal_data")
      .getFirstListItem(`user="${userId}"`);
    personalData.value = record;
    applicationStatus.value = record.status;
  } catch (err) {
    error.value = err.message || "Failed to fetch data";
  }
});
</script>

<template>
  <div
    v-if="!personalData"
    class="bg-primary-foreground rounded p-4 mt-4 w-3/4"
  >
    <ProfilePersonalDataFormNew />
  </div>
  <div
    v-else-if="
      ['submitted', 'approved', 'in review'].includes(applicationStatus)
    "
    class="bg-primary-foreground rounded p-4 mt-4 w-3/4"
  >
    <ProfilePersonalDataDisplay :data="personalData" />
  </div>
  <div
    v-else-if="applicationStatus === 'need update'"
    class="bg-primary-foreground rounded p-4 mt-4 w-3/4"
  >
    <ProfilePersonalDataUpdate :data="personalData" />
  </div>
</template>
