<script setup>
const dataTable = ref([]);

// Format badge classes based on status
const getBadgeClass = (status) => {
  switch (status.toLowerCase()) {
    case 'approved':
      return 'bg-green-400';
    case 'rejected':
      return 'bg-red-400';
    case 'need update':
      return 'bg-yellow-400';
    case 'in review':
      return 'bg-orange-400';
    case 'submitted':
      return 'bg-blue-400';
  }
};


onMounted(async () => {
  try {
    // Fetch SPA application
    const applicationSpaNumber = await useNuxtApp()
      .$pb.collection("application_spa_number")
      .getFirstListItem(`user="${useNuxtApp().$pb.authStore?.record?.id}"`);

    const applicationSpaNumberRow = {
      id: applicationSpaNumber.id,
      userId: applicationSpaNumber.user,
      requestType: "SPA Employment Reference Number Letter",
      created: new Date(applicationSpaNumber.created).toLocaleString("en-MY"),
      updated: new Date(applicationSpaNumber.updated).toLocaleString("en-MY"),
      status: applicationSpaNumber.status,
    };

    dataTable.value.push(applicationSpaNumberRow);

    // Fetch Provisional Certificate application
    const applicationProvisionalCertificate = await useNuxtApp()
      .$pb.collection("application_provisional_certificate")
      .getFirstListItem(`user="${useNuxtApp().$pb.authStore?.record?.id}"`);

    const applicationProvCertRow = {
      id: applicationProvisionalCertificate.id,
      userId: applicationProvisionalCertificate.user,
      requestType: "Provisional Registration Certificate",
      created: new Date(applicationProvisionalCertificate.created).toLocaleString("en-MY"),
      updated: new Date(applicationProvisionalCertificate.updated).toLocaleString("en-MY"),
      status: applicationProvisionalCertificate.status,
    };

    dataTable.value.push(applicationProvCertRow);
  } catch (error) {
    console.error("Error fetching applications:", error);
    // Handle when records don't exist yet
  }
});
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-semibold">Applications list</h1>

      <DropdownMenu>
        <DropdownMenuTrigger><Button>
            New Application
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <NuxtLink to="/application/new/spa">SPA Employment Reference Number Letter</NuxtLink>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <NuxtLink to="/application/new/provisional">Provisional Registration Certificate</NuxtLink>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>


    <Table>
      <TableHeader>
        <TableRow>
          <TableHead class="w-[360px]">Application</TableHead>
          <TableHead>Application ID</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Updated</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="record in dataTable" :key="record.id">
          <TableCell>{{ record.requestType }}</TableCell>
          <TableCell>{{ record.id }}</TableCell>
          <TableCell>{{ record.created }}</TableCell>
          <TableCell>{{ record.updated }}</TableCell>
          <TableCell>
            <Badge :class="getBadgeClass(record.status)">
              {{ record.status }}
            </Badge>
          </TableCell>
          <TableCell>
            <NuxtLink :to="`/application/${record.id}`">
              <Button variant="outline" size="sm">View</Button>
            </NuxtLink>
          </TableCell>
        </TableRow>
        <TableRow v-if="dataTable.length === 0">
          <TableCell colspan="6" class="text-center py-4">
            No applications found. Create a new application using the dropdown above.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
