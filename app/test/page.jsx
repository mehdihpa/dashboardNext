const Page = () => {
  const handleForm = async (formData) => {
    "use server";
    const username = formData.get("username");
    console.log("Hello",username);
    console.log(formData);
  };
  return (
    <div>
      <form action={handleForm}>
        <input type="text" name="username" />
        <button> Send</button>
      </form>
    </div>
  );
};

export default Page;
