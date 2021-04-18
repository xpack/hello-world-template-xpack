/*
 * This file is part of the xPack project (http://xpack.github.io).
 * Copyright (c) 2021 Liviu Ionescu. All rights reserved.
 *
 * This Source Code File is subject to the MIT License terms.
 * If a copy of the license was not distributed with this file, it can
 * be obtained from https://opensource.org/licenses/MIT/.
 */

// ----------------------------------------------------------------------------

#include "hello-world.h"

#include <iostream>

int
main(int argc, char* argv[])
{
  std::cout << HELLO_WORLD_MESSAGE << std::endl;

#if defined(DEBUG)
  std::cout << "(in debug mode)" << std::endl;
#else
  std::cout << "(in release mode)" << std::endl;
#endif

#if defined(NDEBUG)
  std::cout << "(no asserts)" << std::endl;
#endif

  return 0;
}

// ----------------------------------------------------------------------------
