import { useAuth } from "../context/AuthContext";

function CreateVenueForm() {
  const { openAuthModal } = useAuth();
  
  const handleSubmit = (e) => {
    e.preventDefault();

    const isAuthenticated = !!localStorage.getItem("accessToken");
    
    if (!isAuthenticated) {
      openAuthModal(() => {
        console.log("User is now logged in. Continue venue creation...");
        // Run your venue creation logic here
      });
      return;
    }

    // Normal venue submission logic here
  };

  return <form onSubmit={handleSubmit}> {/* Form Fields Here */} </form>;
}

export default CreateVenueForm;