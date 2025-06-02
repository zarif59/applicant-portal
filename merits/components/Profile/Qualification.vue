<script setup>
const qualification = ref(null);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    loading.value = true;
    const userId = useNuxtApp().$pb.authStore?.record?.id;
    const record = await useNuxtApp()
      .$pb.collection("qualification")
      .getFirstListItem(`user="${userId}"`);
    qualification.value = record;
  } catch (err) {
    error.value = err.message || "Failed to fetch data";
  } finally {
    loading.value = false;
  }
});

const data = ref({
  country: "",
  university: "",
  date_of_passed_exam: "",
  date_of_awarded_qualification: "",
  basic_qualification_name: "",
});

const handleSubmit = async () => {
  const certificateFile = document.getElementById("certificateInput").files[0];
  const transcriptFile = document.getElementById("transcriptInput").files[0];

  const formData = {
    user_id: useNuxtApp().$pb.authStore?.record?.id,
    country: data.value.country,
    university: data.value.university,
    date_of_passed_exam: data.value.date_of_passed_exam,
    date_of_awarded_qualification: data.value.date_of_awarded_qualification,
    basic_qualification_name: data.value.basic_qualification_name,
    status: "submitted",
  };

  await uploadQualification(formData, certificateFile, transcriptFile);
};

async function uploadQualification(data, certificateFile, transcriptFile) {
  const formData = new FormData();
  // Append all normal fields
  formData.append("user_id", data.user_id);
  formData.append("country", data.country);
  formData.append("university", data.university);
  formData.append("date_of_passed_exam", data.date_of_passed_exam);
  formData.append(
    "date_of_awarded_qualification",
    data.date_of_awarded_qualification
  );
  formData.append("basic_qualification_name", data.basic_qualification_name);
  formData.append("status", data.status);

  // Append files (must be File or Blob objects)
  formData.append("basic_medical_degree", certificateFile);
  formData.append("academic_transcript", transcriptFile);

  const record = await useNuxtApp()
    .$pb.collection("qualification")
    .create(formData);
  console.log("Created record:", record);
  reloadNuxtApp();
}
</script>

<template>
  <div class="p-2 my-4 w-3/4 bg-muted rounded">
    <div v-if="loading" class="flex items-center justify-center h-32">
      <span>loading...</span>
    </div>
    <div class="p-4" v-else-if="qualification">
      <div class="mb-4 flex items-center gap-2">
        <span class="text-lg font-semibold">Status:</span>
        <span
          :class="[
            'px-3 py-1 rounded text-sm font-medium',
            qualification.status === 'submitted'
              ? 'bg-blue-100 text-blue-700'
              : qualification.status === 'approved'
              ? 'bg-green-100 text-green-700'
              : qualification.status === 'rejected'
              ? 'bg-red-100 text-red-700'
              : 'bg-gray-100 text-gray-700',
          ]"
        >
          {{
            qualification.status.charAt(0).toUpperCase() +
            qualification.status.slice(1)
          }}
        </span>
      </div>
      <pre>{{ qualification }}</pre>
    </div>
    <div
      v-else-if="!qualification"
      class="flex flex-col gap-2 items-center justify-center h-32"
    >
      <h1 class="text-xl font-semibold">No qualification data</h1>
      <Dialog>
        <DialogTrigger as-child>
          <Button>Add qualification</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Qualification Information</DialogTitle>
            <DialogDescription>
              Please fill in your qualification details. Click save when you're
              done.
            </DialogDescription>
          </DialogHeader>
          <div class="grid gap-4 py-4">
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="country">Country</Label>
              <Input id="country" v-model="data.country" class="col-span-3" />
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="university">University</Label>
              <Input
                id="university"
                v-model="data.university"
                class="col-span-3"
              />
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="date_of_passed_exam">Date of Passed Exam</Label>
              <Input
                type="date"
                id="date_of_passed_exam"
                v-model="data.date_of_passed_exam"
                class="col-span-3"
              />
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="date_of_awarded_qualification"
                >Date of Awarded Qualification</Label
              >
              <Input
                type="date"
                id="date_of_awarded_qualification"
                v-model="data.date_of_awarded_qualification"
                class="col-span-3"
              />
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="basic_qualification_name"
                >Basic Qualification Name</Label
              >
              <Input
                id="basic_qualification_name"
                v-model="data.basic_qualification_name"
                class="col-span-3"
              />
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="certificateInput">Certificate</Label>
              <Input type="file" id="certificateInput" class="col-span-3" />
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="transcriptInput">Transcript</Label>
              <Input type="file" id="transcriptInput" class="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" @click="handleSubmit"> Save changes </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  </div>
</template>
