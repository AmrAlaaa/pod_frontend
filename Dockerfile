# Start with the official nginx:alpine image
FROM nginx:alpine

# Install Git to pull the repository
RUN apk --no-cache add git

# Clone the GitHub repository into a temporary directory
RUN git clone https://github.com/AmrAlaaa/pod_frontend /tmp/repo

# Copy the contents of `frontend/src` from the cloned repository to the Nginx HTML directory
RUN cp -r /tmp/repo/frontend/src/* /usr/share/nginx/html/

# Expose port 80 for the web server
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
