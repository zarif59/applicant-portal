<script setup>
const route = useRoute();
const router = useRouter();
const onDisplay = ref("Personal Data");

const list = [
  {
    name: "Personal Data",
  },
  {
    name: "Qualification",
  },
];

onMounted(() => {
  const tab = route.query.tab;
  if (tab && list.some((item) => item.name === tab)) {
    onDisplay.value = tab;
  } else {
    router.replace({ query: { tab: onDisplay.value } });
  }
});

watch(
  () => route.query.tab,
  (tab) => {
    if (tab && list.some((item) => item.name === tab)) {
      onDisplay.value = tab;
    }
  }
);
</script>

<template>
  <div>
    <h1 class="text-2xl font-semibold">Profile</h1>

    <div class="flex gap-4 mt-2">
      <NuxtLink
        v-for="item in list"
        :key="item.name"
        :to="{ query: { tab: item.name } }"
        class="cursor-pointer capitalize"
        :class="{
          'font-semibold text-primary underline underline-offset-4':
            onDisplay === item.name,
        }"
      >
        {{ item.name }}
      </NuxtLink>
    </div>

    <div>
      <ProfilePersonalData v-if="onDisplay === 'Personal Data'" />
      <ProfileQualification v-else-if="onDisplay === 'Qualification'" />
    </div>
  </div>
</template>
