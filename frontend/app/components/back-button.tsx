import { useNavigate } from "react-router";
import { Button } from "./ui/button";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => navigate(-1)}
      className="p-4 mr-4 mb-2"
    >
      ← Back
    </Button>
  );
};

export default BackButton;