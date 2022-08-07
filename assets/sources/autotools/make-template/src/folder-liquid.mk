
# Add inputs and outputs contributed by this folder.
CPP_SRCS += \
../../src/hello-world.{{ fileExtension }} 

OBJS += \
./src/hello-world.o 

CPP_DEPS += \
./src/hello-world.d 

SUBDIRS += ./src

# Each folder must supply rules for building sources it contributes.
src/%.o: ../../src/%.c
	@echo 'Building file: $<'
	@echo 'Invoking: C Compiler'
	$(CC) $(CPPFLAGS) $(CFLAGS) -c -MMD -MP -MF"$(@:%.o=%.d)" -MT"$(@)" -o "$@" "$<"
	@echo 'Finished building: $<'
	@echo ' '

src/%.o: ../../src/%.cpp
	@echo 'Building file: $<'
	@echo 'Invoking: C++ Compiler'
	$(CXX) $(CPPFLAGS) $(CXXFLAGS) -c -MMD -MP -MF"$(@:%.o=%.d)" -MT"$(@)" -o "$@" "$<"
	@echo 'Finished building: $<'
	@echo ' '
