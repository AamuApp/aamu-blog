#!/bin/bash

# Source directory containing Hugo posts
POSTS_DIR="content/posts"

# Output directory for copied .md files
OUTPUT_DIR="ai_output"

# Check if the source directory exists
if [ ! -d "$POSTS_DIR" ]; then
  echo "Error: Directory $POSTS_DIR not found."
  exit 1
fi

# Create the output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Find all index.md files and copy them with renamed titles
find "$POSTS_DIR" -type f -name "index.md" | while read -r file; do
  # Extract the directory name (the [title] part)
  title=$(basename "$(dirname "$file")")
  
  # Define the destination file path
  dest_file="$OUTPUT_DIR/$title.md"
  
  # Copy the file to the output directory with the new name
  cp "$file" "$dest_file"
  
  # Confirm the action
  echo "Copied $file to $dest_file"
done

# Check if any files were copied
if [ -z "$(ls -A "$OUTPUT_DIR")" ]; then
  echo "No index.md files found in $POSTS_DIR."
else
  echo "All files copied to $OUTPUT_DIR."
fi