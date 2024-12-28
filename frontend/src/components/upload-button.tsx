import { useState } from "react";

const UploadAndDisplayImage = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  return (
    <div>
      {/* Header */}
      <h1>Upload and Display Image</h1>
      <h3>using React Hooks cannyseallove</h3>

      {/* Conditionally render the selected image if it exists */}
      {selectedImage && (
        <div>
          {/* Display the selected image */}
          <img
            alt="not found"
            width={"250px"}
            src={URL.createObjectURL(selectedImage)}
          />
          <br /> <br />
          {/* Button to remove the selected image */}
          <button onClick={() => setSelectedImage(null)}>Remove</button>
        </div>
      )}

      <br />

      {/* Input element to select an image file */}
      <input
        type="file"
        name="myImage"
        // Event handler to capture file selection and update the state
        onChange={(event) => {
          if (event.target == null) {
            return;
          }
          const data = new FormData();
          data.append('file', event.target.files![0])
          data.append('name', 'Canny Photo')
          data.append('desc', 'Canny Description')
          fetch("http://127.0.0.1:4000/upload", {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
            },
            body: data
          }).then((response) => {
            console.log(event.target.files![0]); // Log the selected file
            console.log(response)
            setSelectedImage(event.target.files![0]); // Update the state with the selected file
          })
        }}
      />
    </div>
  )
}

export default UploadAndDisplayImage;
