
# Add inputs and outputs contributed by this folder.
C_SRCS += \
../../libs/adder/src/add.c 

OBJS += \
./libs/adder/src/add.o 

C_DEPS += \
./libs/adder/src/add.d 

SUBDIRS += ./libs/adder/src

# Each folder must supply rules for building sources it contributes.
libs/adder/src/%.o: ../../libs/adder/src/%.c
	@echo 'Building file: $<'
	@echo 'Invoking: C Compiler'
	$(CC) $(CPPFLAGS) $(CFLAGS) -c -MMD -MP -MF"$(@:%.o=%.d)" -MT"$(@)" -o "$@" "$<"
	@echo 'Finished building: $<'
	@echo ' '

libs/adder/src/%.o: ../../libs/adder/src/%.cpp
	@echo 'Building file: $<'
	@echo 'Invoking: C++ Compiler'
	$(CXX) $(CPPFLAGS) $(CXXFLAGS) -c -MMD -MP -MF"$(@:%.o=%.d)" -MT"$(@)" -o "$@" "$<"
	@echo 'Finished building: $<'
	@echo ' '
