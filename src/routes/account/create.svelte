<script lang="ts">
    import Input from "@components/input.svelte"
    import Button from "@components/button.svelte"

    let username: string = ""
    let password: string = ""

    const submit = async () => {
        const response = await fetch("/api/account/create", {
            method: "post",
            body: JSON.stringify({
                username: username,
                password: password
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })

        const responseBody = await response.json()

        if (responseBody.succes) {
            localStorage.setItem("token", responseBody.token)
            localStorage.setItem("username", username)
            localStorage.setItem("uid", responseBody.uid)
            localStorage.setItem("loggedInAt", (new Date()).valueOf().toString())
        }
    }
</script>

<h1>Create Account</h1>
<Input label="username" type="text" bind:value={username} />
<Input label="password" type="password" bind:value={password} />
<Button label="Create account" on:click={submit} />


