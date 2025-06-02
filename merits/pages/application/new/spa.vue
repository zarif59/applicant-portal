<script setup>
const url = useRequestURL();

const data = {
    "user": useNuxtApp().$pb.authStore?.record?.id,
    "status": "submitted",
    "status_details": JSON.stringify([
        { "document": "declaration_form", "status": "submitted" },
        { "document": "basic_medical_degree", "status": "submitted" }
    ])
};

const createBill = async (recordId) => {
    try {
        const billPayload = new FormData();
        billPayload.append('userSecretKey', useRuntimeConfig().public.toyyibpaySecretKey);
        billPayload.append('categoryCode', '4j4dut4j');
        billPayload.append('billName', 'SPA Application Fee');
        billPayload.append('billDescription', `Application ID: ${recordId}`);
        billPayload.append('billPriceSetting', 1);
        billPayload.append('billPayorInfo', 1);
        billPayload.append('billAmount', 100 * 100); // Amount in cents
        billPayload.append('billTo', useNuxtApp().$pb.authStore?.record?.name);
        billPayload.append('billEmail', useNuxtApp().$pb.authStore?.record?.email);
        billPayload.append('billPhone', '0123456789');
        billPayload.append('billReturnUrl', `${url.origin}/payment/success`);
        billPayload.append('billExternalReferenceNo', recordId);
        billPayload.append('billPaymentChannel', '2');

        const response = await $fetch(`${useRuntimeConfig().public.toyyibpayUrl}/api/createBill`, {
            method: 'POST',
            body: billPayload
        });

        const resJson = await JSON.parse(response);
        alert('Bill code generated successfully: ' + resJson[0]?.BillCode + '. Now updating the application record...');

        if (resJson && resJson.length > 0 && resJson[0].BillCode) {

            // Update the application record with the bill code
            await useNuxtApp().$pb.collection("application_spa_number").update(recordId, {
                bill_code: resJson[0].BillCode,
                payment_status: 'pending'
            });

            alert('Bill is ready. Redirecting to payment page...');
            window.location.href = `${useRuntimeConfig().public.toyyibpayUrl}/${resJson[0].BillCode}`;

        } else {
            throw new Error('Failed to generate bill code');
        }
    } catch (error) {
        console.error('Error creating bill:', error);
        alert(`Error creating payment: ${error.message}`);
    } finally {
    }
};

const handleSumbit = async () => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
    });
    const basicMedicalDegreeInput = document.getElementById("basicMedicalDegree");
    if (basicMedicalDegreeInput && basicMedicalDegreeInput.files.length > 0) {
        formData.append("basic_medical_degree", basicMedicalDegreeInput.files[0]);
    }
    const declarationFormInput = document.getElementById("declarationForm");
    if (declarationFormInput && declarationFormInput.files.length > 0) {
        formData.append("declaration_form", declarationFormInput.files[0]);
    }

    await useNuxtApp()
        .$pb.collection("application_spa_number")
        .create(formData)
        .then(async (record) => {
            alert("Record created: " + record.id + ". Now creating bill...");

            await createBill(record.id);
        })
        .catch((error) => {
            alert("Error submitting form: " + error.message);
        });
}



</script>

<template>
    <div>
        <div class="flex justify-between">
            <h1 class="text-2xl font-semibold">Visit</h1>
        </div>

        <div class="flex flex-col md:flex-row gap-4 mt-4">
            <div class="md:w-1/4">
                <div class="bg-primary-foreground rounded p-4">
                    <h1>Personal data information here</h1>
                </div>
            </div>
            <div class="md:w-3/4">
                <div class="bg-primary-foreground rounded p-4">
                    <form @submit.prevent="handleSumbit">
                        <div class="flex flex-col mb-4 gap-2">
                            <Label>Basic Medical Degree</Label>
                            <Input type="file" id="basicMedicalDegree" required accept="application/pdf" />
                        </div>
                        <div class="flex flex-col gap-2">
                            <Label>Declaration Form</Label>
                            <Input type="file" id="declarationForm" required accept="application/pdf" />
                        </div>
                        <Button type="submit" class="mt-4">Submit and proceed to payment</Button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>